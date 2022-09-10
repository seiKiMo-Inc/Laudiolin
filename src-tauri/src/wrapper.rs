// A Tauri-based wrapper for Laudiolin Rust bindings.

use crate::backend::{DownloadOptions, SearchOptions, SearchResults};
use once_cell::sync::OnceCell;
use tauri::{Manager, Wry, AppHandle};
use tauri::api::path;
use serde::Serialize;

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
        TauriApp::global().path_resolver().app_dir().unwrap()
            .join(path).to_str().unwrap().to_string()
    }
}

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
        file_path: TauriApp::file(format!("{}.mp3", id))
    };

    let file_name = tauri::async_runtime::block_on(async {
        crate::backend::download(id, options).await
    });

    file_name.unwrap()
}