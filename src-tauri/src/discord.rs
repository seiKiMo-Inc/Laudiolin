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
pub struct Presence<'a> {
    #[serde(skip_serializing_if = "Option::is_none")]
    details: Option<&'a str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    state: Option<&'a str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    start_timestamp: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    end_timestamp: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    large_image_key: Option<&'a str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    large_image_text: Option<&'a str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    small_image_key: Option<&'a str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    small_image_text: Option<&'a str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    party_id: Option<&'a str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    party_size: Option<[i32; 2]>,
    #[serde(skip_serializing_if = "Option::is_none")]
    match_secret: Option<&'a str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    join_secret: Option<&'a str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    spectate_secret: Option<&'a str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    button_one_label: Option<&'a str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    button_one_url: Option<&'a str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    button_two_label: Option<&'a str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    button_two_url: Option<&'a str>
}

/// Creates a Discord IPC client.
/// The client ID is fetched from the settings file.
pub fn initialize() {
    // Create an instance of the Discord IPC client.
    let mut client = DiscordIpcClient::new("1020193478556266536").unwrap();
    // Connect to the Discord client.
    if client.connect().is_ok() {
        // Set the client instance.
        *CLIENT.lock().unwrap() = client;
    }
}

/// Updates the Discord rich presence.
/// This method has an external 15 second cooldown.
/// presence: The details of the presence to push to the client.
#[tauri::command]
pub fn update_presence(presence: Presence) {
    // Get the client.
    let mut client = CLIENT.lock().unwrap();

    // Create the presence.
    let mut payload = activity::Activity::new();
    // Set fields.
    if presence.details.is_some() { payload = payload.details(&*presence.details.unwrap()); }
    if presence.state.is_some() { payload = payload.state(&*presence.state.unwrap()); }

    // Set timestamps.
    let mut timestamps = activity::Timestamps::new();
    if presence.start_timestamp.is_some() { timestamps = timestamps.start(presence.start_timestamp.unwrap()); }
    if presence.end_timestamp.is_some() { timestamps = timestamps.end(presence.end_timestamp.unwrap()); }
    payload = payload.timestamps(timestamps);

    // Set assets.
    let mut assets = activity::Assets::new();
    if presence.large_image_key.is_some() { assets = assets.large_image(&*presence.large_image_key.unwrap()); }
    if presence.large_image_text.is_some() { assets = assets.large_text(&*presence.large_image_text.unwrap()); }
    if presence.small_image_key.is_some() { assets = assets.small_image(&*presence.small_image_key.unwrap()); }
    if presence.small_image_text.is_some() { assets = assets.small_text(&*presence.small_image_text.unwrap()); }
    payload = payload.assets(assets);

    // Set party.
    // let mut party = activity::Party::new();
    // if presence.party_id.is_some() { party = party.id(&*presence.party_id.unwrap()); }
    // if presence.party_size.is_some() { party = party.size(presence.party_size.unwrap()); }
    // payload = payload.party(party);

    // Set secrets.
    // let mut secrets = activity::Secrets::new();
    // if presence.match_secret.is_some() { secrets = secrets.r#match(&*presence.match_secret.unwrap()); }
    // if presence.join_secret.is_some() { secrets = secrets.join(&*presence.join_secret.unwrap()); }
    // if presence.spectate_secret.is_some() { secrets = secrets.spectate(&*presence.spectate_secret.unwrap()); }
    // payload = payload.secrets(secrets);

    // Set buttons.
    let mut buttons = Vec::with_capacity(2);
    if presence.button_one_label.is_some() && presence.button_one_url.is_some() {
        buttons.push(activity::Button::new(&*presence.button_one_label.unwrap(), &*presence.button_one_url.unwrap()));
    }
    if presence.button_two_label.is_some() && presence.button_two_url.is_some() {
        buttons.push(activity::Button::new(&*presence.button_two_label.unwrap(), &*presence.button_two_url.unwrap()));
    }
    payload = payload.buttons(buttons);

    // Update the presence.
    client.set_activity(payload).unwrap_or_else(|_| {
        println!("Failed to update presence.");
    });
}

/// Clears the Discord rich presence.
/// This method has an external 15 second cooldown.
#[tauri::command]
pub fn clear_presence() {
    // Get the client.
    let mut client = CLIENT.lock().unwrap();

    // Clear the presence.
    client.clear_activity().unwrap_or_else(|_| {
        println!("Failed to clear presence.");
    });
}