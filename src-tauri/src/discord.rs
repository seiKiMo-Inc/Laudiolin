// Discord Integration for Laudiolin.
// Calls to update the presence are from the frontend.
// This class handles the IPC calls to the Discord client's backend.

use serde::{Serialize, Deserialize};
use lazy_static::lazy_static;
use std::sync::Mutex;
use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};

lazy_static! {
    static ref CLIENT: Mutex<DiscordIpcClient> =
    Mutex::new(DiscordIpcClient::new("787000000000000000").unwrap());
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Presence {
    pub details: String,
    pub state: String,
    pub start_timestamp: i64,
    pub end_timestamp: i64,
    pub large_image_key: String,
    pub large_image_text: String,
    pub small_image_key: String,
    pub small_image_text: String,
    pub party_id: String,
    pub party_size: [i32; 2],
    pub match_secret: String,
    pub join_secret: String,
    pub spectate_secret: String,
    pub instance: bool,
}

/// Creates a Discord IPC client.
/// The client ID is fetched from the settings file.
pub fn initialize() {
    // Create an instance of the Discord IPC client.
    let mut client = DiscordIpcClient::new("1027411328119345152").unwrap();
    // Connect to the Discord client.
    client.connect().expect("Unable to connect to Discord client");

    // Set the client instance.
    *CLIENT.lock().unwrap() = client;
}

/// Updates the Discord rich presence.
/// This method has an external 15 second cooldown.
/// presence: The details of the presence to push to the client.
#[tauri::command]
pub fn update_presence(presence: Presence) {
    // Get the client.
    let mut client = CLIENT.lock().unwrap();

    // Update the presence.
    let payload = activity::Activity::new()
        .details(&*presence.details)
        .state(&*presence.state)
        .timestamps(activity::Timestamps::new()
            .start(presence.start_timestamp)
            .end(presence.end_timestamp)
        )
        .assets(activity::Assets::new()
            .large_image(&*presence.large_image_key)
            .large_text(&*presence.large_image_text)
            .small_image(&*presence.small_image_key)
            .small_text(&*presence.small_image_text)
        )
        .party(activity::Party::new()
            .id(&*presence.party_id)
            .size(presence.party_size)
        )
        .secrets(activity::Secrets::new()
            .r#match(&*presence.match_secret)
            .join(&*presence.join_secret)
            .spectate(&*presence.spectate_secret)
        );
    client.set_activity(payload)
        .expect("Unable to update presence");
}