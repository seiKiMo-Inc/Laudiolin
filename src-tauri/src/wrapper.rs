// A Tauri-based wrapper for Laudiolin Rust bindings.

use crate::backend::{DownloadOptions, SearchOptions, SearchResults};

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
        engine: engine.to_string()
    };


    let file_name = tauri::async_runtime::block_on(async {
        crate::backend::download(id, options).await
    });

    file_name.unwrap()
}