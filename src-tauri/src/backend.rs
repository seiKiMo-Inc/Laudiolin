// Backend Rust bindings for the Laudiolin API.
// Use with https://github.com/Dumbfuckery-Inc/Laudiolin-Backend

use reqwest::get;
use serde::{Deserialize, Serialize};
use std::io::Write;

pub struct SearchOptions {
    pub engine: String
}
pub struct DownloadOptions {
    pub engine: String
}

#[derive(Serialize, Deserialize)]
pub struct SearchResult {
    pub title: String,
    pub artist: String,
    pub icon: String,
    pub url: String,
    pub id: String,
    pub duration: u64
}
#[derive(Serialize, Deserialize)]
pub struct SearchResults {
    pub top: SearchResult,
    pub results: Vec<SearchResult>
}

/// Performs a search for the query.
/// query: The query to search for.
/// options: The options to use for the search.
pub async fn search(query: &str, options: SearchOptions) -> Result<SearchResults, &'static str> {
    // Perform the request.
    let response = get(format!("https://app.magix.lol/search/{}?query={}",
                               query, options.engine)).await.unwrap();

    // Check the response code.
    if response.status() != 301 {
        return Err("Request failed.");
    }

    // Parse the response.
    let json = response.text().await.unwrap();
    Ok(serde_json::from_str(&*json).unwrap())
}

/// Downloads the song using the given ID.
/// id: The ID of the song to download. (YouTube video ID/ISRC)
/// options: The options to use for the download.
pub async fn download(id: &str, options: DownloadOptions) -> Result<String, &'static str> {
    // Perform the request.
    let response = get(format!("https://app.magix.lol/download?id={}&engine={}",
                               id, options.engine)).await.unwrap();

    // Check the status code.
    if response.status() != 301 {
        return Err("Request failed.");
    }

    // Save the response to a file.
    let mut file = std::fs::File::create(format!("{}.mp3", id)).unwrap();
    file.write_all(response.bytes().await.unwrap().as_ref()).unwrap();

    // Return the path to the file.
    Ok(format!("{}.mp3", id))
}