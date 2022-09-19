// Audio library for Howler.
// Playback is handled on the frontend.
// This library is used to interact with the player.

use serde::Serialize;
use serde_json::{from_str};
use std::fs::read_to_string;
use crate::backend::{Playlist, SearchResult};
use crate::wrapper::{TauriApp, download};
use crate::settings::get_settings;

#[derive(Clone, Serialize)]
pub struct PlayAudioPayload {
    file_path: String,
    track_data: SearchResult,
    volume: f32
}
#[derive(Clone, Serialize)]
pub struct PlayPlaylistPayload {
    playlist: Playlist
}

/// Downloads the specified track and returns a play payload.
/// track: The track to download.
#[tauri::command]
pub fn make_track(track: SearchResult) -> PlayAudioPayload {
    // Download the track.
    let file_path = download(track.id.as_str(),
                             get_settings().search.engine.as_str());
    
    PlayAudioPayload {
        file_path,
        track_data: track,
        volume: 1.0
    }
}

/// Play an audio track from a search result.
/// track: The search result of the track to play.
#[tauri::command]
pub fn play_from(track: SearchResult) {
    // TODO: Check frontend for TODOs.

    // Download the audio track.
    let file_name = download(track.id.as_str(), "YouTube");

    // Play audio from the downloaded track.
    play_audio(file_name, track);
}

/// Plays the specified audio file with the specified track data.
/// file_path: The path to the audio file. (MP3)
/// track_data: The track data to play. (should be a search result)
#[tauri::command]
pub fn play_audio(file_path: String, track_data: SearchResult) {
    let payload = PlayAudioPayload {
        file_path,
        track_data,
        volume: 1.0
    };

    // Send the payload to the frontend.
    TauriApp::emit("play_audio", payload);
}

/// Plays the specified playlist.
/// playlist: The ID of the playlist. Should be a file on the user's computer.
#[tauri::command]
pub fn play_playlist(playlist: String) {
    // Read the playlist from file.
    let playlist_data = read_to_string(playlist).expect("Unable to read playlist file");
    let playlist: Playlist = from_str(playlist_data.as_str()).expect("Unable to parse playlist file");

    // Send the playlist to the frontend.
    TauriApp::emit("play_playlist", PlayPlaylistPayload { playlist });
}