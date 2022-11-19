// Backend Rust bindings for the Laudiolin API.
// Use with https://github.com/Dumbfuckery-Inc/Laudiolin-Backend

use serde::{Deserialize, Serialize};
use std::io::Write;

use reqwest::get;
use crate::wrapper;

#[derive(Debug)]
pub struct Client {

}
trait Backend {
    /*
     * Player functions.
     */

    fn volume(&self, volume: u8);
    fn track_sync(&self, track: SearchResult, progress: u64);

    /*
     * Gateway functions.
     */

    fn send(&self, data: String);

    /*
     * Data functions.
     */

    // fn save_playlist(&self, playlist: Playlist);
}
impl Backend for Client {
    fn volume(&self, volume: u8) {
        wrapper::volume(volume);
    }

    fn track_sync(&self, track: SearchResult, progress: u64) {
        wrapper::track_sync(track, progress);
    }

    fn send(&self, data: String) {
        wrapper::send(data);
    }

    // fn save_playlist(&self, playlist: Playlist) {
    //     wrapper::save_playlist(playlist);
    // }
}

pub struct SearchOptions {
    pub engine: String
}
pub struct DownloadOptions {
    pub engine: String,
    pub file_path: String
}

/// Doubles as a track.
#[derive(Clone, Serialize, Deserialize)]
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

#[derive(Clone, Serialize, Deserialize)]
pub struct Playlist {
    pub id: String,
    pub name: String,
    pub description: String,
    pub icon: String,
    pub tracks: Vec<SearchResult>
}

#[derive(Serialize, Deserialize)]
pub struct GatewayMessage {
    #[serde(rename = "type")]
    pub _type: String,
    pub timestamp: u64
}

// Backend Rust bindings for the Laudiolin gateway. \\

/// Invoked when the gateway receives a message.
/// This function is called by the gateway when a message is received.
/// client: The client handling the message.
/// data: The message received. (JSON)
pub fn gateway_handle_message(client: &Client, data: &str) -> Result<(), &'static str> {
    // Parse the gateway message.
    let parsed_data: GatewayMessage = serde_json::from_str(data).unwrap();

    match parsed_data._type.as_str() {
        "volume" => Ok(client.volume(parse_volume(data))),
        "listening" => Ok(()),
        "sync" => Ok(client.track_sync(parse_track(data), parse_progress(data))),

        _ => Err("Invalid message type")
    }
}

/// Sends a message to the gateway.
/// gateway: The gateway to send messages to.
/// data: The data to send. Should include a type and a timestamp.
// pub async fn gateway_message(gateway: &Client, data: impl Serialize) {
//     // Serialize the data.
//     let data = serde_json::to_string(&data).unwrap();
//     // Send the message.
//     gateway.send(data);
// }

// Parsing methods for data received by the Laudiolin gateway. \\

#[derive(Deserialize)]
pub struct VolumeMessage {
    #[serde(rename = "type")]
    pub _type: String,
    pub timestamp: u64,
    pub volume: u8,
    pub send_back: bool
}
#[derive(Deserialize)]
pub struct ListeningMessage {
    #[serde(rename = "type")]
    pub _type: String,
    pub timestamp: u64,
    pub listen: bool,
    #[serde(rename = "totalClients")]
    pub total_clients: u64
}
#[derive(Deserialize)]
pub struct SyncMessage {
    #[serde(rename = "type")]
    pub _type: String,
    pub timestamp: u64,
    pub track: SearchResult,
    pub progress: u64
}

/// Internal method for parsing JSON.
/// Uses serde_json::from_str.
fn parse<'a, T>(data: &'a str) -> T
where T: Deserialize<'a> {
    serde_json::from_str(data).expect("Unable to parse data")
}

fn parse_volume(data: &str) -> u8 {
    let data: VolumeMessage = parse(data); data.volume
}
fn parse_track(data: &str) -> SearchResult {
    let data: SyncMessage = parse(data); data.track
}
fn parse_progress(data: &str) -> u64 {
    let data: SyncMessage = parse(data); data.progress
}

// Backend Rust bindings for the Laudiolin API. \\

/// Performs a search for the query.
/// query: The query to search for.
/// options: The options to use for the search.
pub async fn search(query: &str, options: SearchOptions) -> Result<SearchResults, &'static str> {
    // Get the user settings.
    let gateway = wrapper::gateway();

    // Perform the request.
    let response = get(format!("{}://{}:{}/search/{}?query={}",
                               wrapper::protocol(), gateway.address,
                               gateway.port, query, options.engine))
        .await.expect("Failed to perform search request");

    // Check the response code.
    if response.status() != 301 {
        return Err("Request failed.");
    }

    // Parse the response.
    let json = response.text().await.expect("Unable to get response body");
    Ok(serde_json::from_str(&*json).expect("Unable to parse response body"))
}

/// Downloads the song using the given ID.
/// id: The ID of the song to download. (YouTube video ID/ISRC)
/// options: The options to use for the download.
pub async fn download(id: &str, options: DownloadOptions) -> Result<String, &'static str> {
    // Check if the file already exists.
    if std::path::Path::new(&options.file_path).exists() {
        return Ok(options.file_path);
    }

    // Get the user settings.
    let gateway = wrapper::gateway();

    // Perform the request.
    let response = get(format!("{}://{}:{}/download?id={}&engine={}",
                               wrapper::protocol(), gateway.address,
                               gateway.port, id, options.engine))
        .await.expect("Failed to perform download request");

    // Check the status code.
    if response.status() != 200 || response.status() != 301 {
        return Err("Request failed.");
    }

    // Save the response to a file.
    let file_path = options.file_path;
    let mut file = std::fs::File::create(file_path.clone()).expect("Unable to create file");
    file.write_all(response.bytes().await.expect("Unable to get response body")
        .as_ref()).expect("Unable to write to file");

    // Return the path to the file.
    Ok(file_path)
}