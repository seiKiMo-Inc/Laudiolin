// Audio library for Howler.
// Playback is handled on the frontend.
// This library is used to interact with the player.

use serde::Serialize;
use crate::wrapper::TauriApp;

#[derive(Clone, Serialize)]
pub struct PlayAudioPayload {
    file_path: String,
    volume: f32
}

#[tauri::command]
pub fn play_audio(file_path: String) {
    let payload = PlayAudioPayload {
        file_path,
        volume: 1.0
    };

    // Send the payload to the frontend.
    TauriApp::emit("play_audio", payload);
}