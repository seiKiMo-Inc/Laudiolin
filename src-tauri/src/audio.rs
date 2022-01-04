// Audio library for Howler.
// Playback is handled on the frontend.
// This library is used to interact with the player.

use serde::Serialize;
use crate::backend::SearchResult;
use crate::wrapper::{TauriApp, download};

#[derive(Clone, Serialize)]
pub struct PlayAudioPayload {
    file_path: String,
    track_data: SearchResult,
    volume: f32
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