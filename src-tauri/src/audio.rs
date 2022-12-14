// Audio library for Howler.
// Playback is handled on the frontend.
// This library is used to interact with the player.

use serde::Serialize;
use serde_json::{from_str};
use std::fs::read_to_string;
use crate::backend::{Playlist, SearchResult};
use crate::wrapper::TauriApp;
use crate::file_exists;
use crate::wrapper;
use crate::settings::get_settings;
use crate::wrap;

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

/// Identifies the search engine for a given ID.
/// id: The ID of the track.
fn identify_engine_from_id(id: &str) -> &str {
    return match id.len() {
        11 => "YouTube",
        12 => "Spotify",
        _ => "All"
    }
}

/// Downloads the specified track and returns a play payload.
/// track: The track to download.
#[tauri::command]
pub async fn make_track(track: SearchResult) -> PlayAudioPayload {
    // Download the track.
    let track_id = track.id.as_str();
    let file_path = wrapper::download(track_id.clone(),
                                      identify_engine_from_id(track_id.clone()))
        .await.unwrap();

    PlayAudioPayload {
        file_path,
        track_data: track,
        volume: 0.7
    }
}

/// Creates a play audio payload.
/// Useful for needing to play audio with whatever is quickest.
/// track: The track to play.
#[tauri::command]
pub async fn create_audio_payload(track: SearchResult) -> PlayAudioPayload {
    let id = track.id.as_str();
    // TODO: Check frontend for TODOs.

    // Check if the file is already downloaded.
    let mut source_path = TauriApp::file(format!("downloads/{}.mp3", id.clone()));
    if !file_exists(source_path.clone()) {
        // Stream the audio track.
        let gateway = wrapper::gateway();
        let engine = get_settings().search.engine.clone();
        source_path = format!("{}://{}:{}/download?id={}&engine={}",
                              wrapper::protocol(), gateway.address,
                              gateway.port, id, engine);
    }

    PlayAudioPayload {
        file_path: source_path,
        track_data: track,
        volume: 0.7
    }
}

/// Play an audio track from a search result.
/// track: The search result of the track to play.
#[tauri::command]
pub fn play_from(track: SearchResult) {
    let id = track.id.as_str();

    // Check if the file is already downloaded.
    let mut source_path = TauriApp::file(format!("downloads/{}.mp3", id.clone()));
    if !file_exists(source_path.clone()) {
        // Stream the audio track.
        let gateway = wrapper::gateway();
        let engine = get_settings().search.engine.clone();
        source_path = format!("{}://{}:{}/download?id={}&engine={}",
                              wrapper::protocol(), gateway.address,
                              gateway.port, id, engine);
    }

    // Play audio from the source.
    play_audio(source_path, track);
}

/// Plays the specified audio file with the specified track data.
/// file_path: The path to the audio file. (MP3)
/// track_data: The track data to play. (should be a search result)
#[tauri::command]
pub fn play_audio(file_path: String, track_data: SearchResult) {
    let payload = PlayAudioPayload {
        file_path,
        track_data,
        volume: 0.7
    };

    // Send the payload to the frontend.
    TauriApp::emit("play_audio", payload);
}

/// Plays the specified playlist.
/// playlist: The ID of the playlist. Should be a file on the user's computer.
#[tauri::command]
pub fn play_playlist(playlist: String) {
    // Read the playlist from file.
    let playlist_data = wrap(read_to_string(playlist), "playlistread");
    let playlist: Playlist = wrap(from_str(playlist_data.as_str()), "playlistparse");

    // Send the playlist to the frontend.
    TauriApp::emit("play_playlist", PlayPlaylistPayload { playlist });
}

/// Check if the specified track audio exists on the file system.
/// id: The ID of the track to check.
#[tauri::command]
pub fn track_exists(id: &str) -> bool {
    let path = TauriApp::file(format!("downloads/{}.mp3", id));
    return file_exists(path);
}