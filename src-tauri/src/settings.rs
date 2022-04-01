// Settings container for Laudiolin.

use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string};
use std::path::Path;
use std::fs::File;
use std::io::{Read, Write};
use crate::wrapper::TauriApp;
use crate::wrap;

#[derive(Clone, Serialize, Deserialize)]
pub struct UserSettings {
    pub search: SearchSettings,
    pub audio: AudioSettings,
    pub gateway: GatewaySettings,
    pub ui: UISettings,
    pub token: String
}

#[derive(Clone, Serialize, Deserialize)]
pub struct SearchSettings {
    pub accuracy: bool,
    pub engine: String
}

#[derive(Clone, Serialize, Deserialize)]
pub struct AudioSettings {
    pub download_path: String
}

#[derive(Clone, Serialize, Deserialize)]
pub struct GatewaySettings {
    pub encrypted: bool,
    pub address: String,
    pub port: u16,
    pub gateway_port: u16
}

#[derive(Clone, Serialize, Deserialize)]
pub struct UISettings {
    pub background_color: String,
    pub background_url: String
}

static mut SETTINGS: Option<UserSettings> = None;

/// Reads the user settings from file.
/// file: The file to read from.
/// Returns the user settings.
#[tauri::command]
pub fn read_from_file(file_path: &str) {
    // Check if file exists.
    if !Path::new(file_path).exists() {
        // Create the file.
        let mut file = wrap(File::create(file_path), "settingscreate");
        // Serialize the default settings.
        let serialized = wrap(to_string(&UserSettings {
            search: SearchSettings {
                accuracy: false,
                engine: "YouTube".to_string()
            },
            audio: AudioSettings {
                download_path: "downloads".to_string()
            },
            gateway: GatewaySettings {
                encrypted: true,
                address: "app.magix.lol".to_string(),
                port: 443,
                gateway_port: 443
            },
            ui: UISettings {
                background_color: "".to_string(),
                background_url: "".to_string()
            },
            token: String::from("")
        }), "serialize");

        // Write the default settings to the file.
        wrap(file.write_all(serialized.as_bytes()), "settingssave");
    }

    // Read the file.
    let file = wrap(File::open(file_path), "settingsopen");
    let file_content = String::from_utf8(file.bytes()
        .map(|b| wrap(b, "settingsread"))
        .collect());

    // Deserialize the settings file.
    let settings = wrap(from_str(
        &wrap(file_content, "deserialize")), "settingsparse");
    // Set the settings.
    unsafe { SETTINGS = Some(settings); }
}

/// Returns the user's settings.
#[tauri::command]
pub fn get_settings() -> UserSettings {
    unsafe { SETTINGS.clone().unwrap() }
}

/// Saves the user's settings to a file and memory.
/// settings: The settings to save.
#[tauri::command]
pub fn save_settings(settings: UserSettings) {
    // Write the settings to variable.
    unsafe { SETTINGS = Some(settings.clone()); }
    // Serialize the settings.
    let serialized = wrap(to_string(&settings), "settingsserialize");
    // Write the settings to file.
    let file_path = TauriApp::file("settings.json".to_string());
    let mut file = wrap(File::create(file_path), "settingscreate");
    wrap(file.write_all(serialized.as_bytes()), "settingssave");
}