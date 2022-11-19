// A Tauri-based wrapper for Laudiolin Rust bindings.

use crate::backend::*;

use once_cell::sync::OnceCell;
use tauri::{Manager, Wry, AppHandle};
use serde::Serialize;

use crate::settings::{GatewaySettings, get_settings};

static APP_INSTANCE: OnceCell<AppHandle<Wry>> = OnceCell::new();
pub struct TauriApp {

}
impl TauriApp {
    pub fn global() -> &'static AppHandle<Wry> {
        APP_INSTANCE.get().expect("App instance not initialized")
    }

    pub fn set(app: AppHandle<Wry>) {
        APP_INSTANCE.set(app).unwrap();
    }

    pub fn emit<S: Serialize + Clone>(event: &str, payload: S) {
        TauriApp::global().emit_all(event, payload).unwrap();
    }

    pub fn file(path: String) -> String {
        TauriApp::global().path_resolver().app_data_dir().unwrap()
            .join(path).to_str().unwrap().to_string()
    }
}

// Defining structures for events. \\

#[derive(Clone, Serialize)]
struct MessagePayload {
    data: String
}
#[derive(Clone, Serialize)]
struct VolumePayload {
    volume: u8
}
#[derive(Clone, Serialize)]
struct TrackSyncPayload {
    track: SearchResult,
    progress: u64
}
#[derive(Clone, Serialize)]
struct HandoffCodePayload {
    code: String
}

// Implementations for backend structures. \\

static CLIENT_INSTANCE: OnceCell<Client> = OnceCell::new();

/// Sets the audio player's volume.
/// volume: Percentage out of 1.0 (100).
pub fn volume(volume: u8) {
    TauriApp::emit("set_volume", VolumePayload { volume });
}

/// Syncs the player with the specified data.
/// track: The track to play (if not already playing).
/// progress: The progress of the track. (seek)
pub fn track_sync(track: SearchResult, progress: u64) {
    let payload = TrackSyncPayload {
        track, progress
    };

    TauriApp::emit("track_sync", payload);
}

/// Sends data to the gateway.
/// data: The data to send.
pub fn send(data: String) {
    TauriApp::emit("send_message", MessagePayload { data });
}

/// Sets the client's authorization code.
/// code: The authorization code.
pub fn set_code(code: String) {
    TauriApp::emit("set_code", HandoffCodePayload { code });
}

/// Saves the specified playlist as a file.
/// playlist: The playlist to save.
// pub fn save_playlist(playlist: Playlist) {
//
// }

/// Returns gateway settings.
pub fn gateway() -> GatewaySettings {
    return get_settings().gateway;
}

pub fn protocol() -> String {
    return match gateway().encrypted {
        true => "https",
        false => "http"
    }.to_string();
}

pub fn initialize() {
    // Create client instance.
    CLIENT_INSTANCE.set(Client {}).unwrap();

    // Setup event listeners.
    TauriApp::global().listen_global("receive_message", |event| {
        gateway_handle_message(
            CLIENT_INSTANCE.get().expect("Client instance not initialized"),
            event.payload().expect("Unable to decode payload"))
            .expect("Unable to handle message");
    });
}

// Wrapper methods for the Laudiolin backend. \\

/// Performs a search for the query.
/// query: The query to search for.
/// engine: The engine to use for the search.
#[tauri::command]
pub fn search(query: &str, engine: &str) -> SearchResults {
    let options = SearchOptions {
        engine: engine.to_string()
    };

    let results = tauri::async_runtime::block_on(async {
        crate::backend::search(query, options).await
    });

    results.unwrap()
}

/// Downloads the song using the given ID.
/// id: The ID of the song to download. (YouTube video ID/ISRC)
/// engine: The engine to use for the download.
#[tauri::command]
pub fn download(id: &str, engine: &str) -> String {
    let options = DownloadOptions {
        engine: engine.to_string(),
        file_path: TauriApp::file(format!("downloads/{}.mp3", id))
    };

    let file_name = tauri::async_runtime::block_on(async {
        crate::backend::download(id, options).await
    });

    file_name.unwrap()
}