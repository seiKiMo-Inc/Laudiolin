// Settings container for Laudiolin.

use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string};
use std::path::Path;
use std::fs::File;
use std::io::{Read, Write};

#[derive(Clone, Serialize, Deserialize)]
pub struct UserSettings {
    pub search: SearchSettings,
    pub audio: AudioSettings,
    pub gateway: GatewaySettings,
    pub ui: UISettings
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
        let mut file = File::create(file_path).expect("Unable to create file");
        // Write the default settings to the file.
        file.write_all(to_string(&UserSettings {
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
            }
        }).expect("Unable to serialize default settings").as_bytes())
            .expect("Unable to save default settings");
    }

    // Read the file.
    let file = File::open(file_path).expect("Unable to open file");
    let file_content = String::from_utf8(file.bytes()
        .map(|b| b.expect("Unable to read file"))
        .collect()).expect("Unable to read file");

    // Deserialize the settings file.
    let settings = from_str(&file_content).expect("Unable to parse settings file.");
    // Set the settings.
    unsafe { SETTINGS = Some(settings); }
}

/// Returns the user's settings.
#[tauri::command]
pub fn get_settings() -> UserSettings {
    unsafe { SETTINGS.clone().unwrap() }
}