#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{App, Wry, Manager};
use window_shadows::set_shadow;
use tokio::fs::File;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use base64::{Engine as _, engine::general_purpose};

/// Wraps Result instances into an output.
/// Any errors are passed to the frontend.
/// obj: The object to wrap.
pub fn wrap<O, E>(obj: Result<O, E>, code: &str) -> O {
    match obj {
        Ok(output) => output,
        Err(_) => {
            panic!("An error occurred in the backend. {}", code);
        }
    }
}

fn main() {
    // Check for an existing deep link instance.
    tauri_plugin_deep_link::prepare("laudiolin");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open, online, exists, save_file, get_file, create_dir, delete
        ])
        .setup(|app| {
            // Initialize deep linking.
            register_deep_link(app);

            // Set the window shadow.
            let window = app.get_window("main").unwrap();
            wrap(set_shadow(&window, true), "shadow");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/// Opens the specified URL in the default browser.
/// url: The URL to open.
#[tauri::command]
fn open(url: String) {
    wrap(open::that(url), "open");
}

/// Check if the device is online.
#[tauri::command]
async fn online() -> bool {
    // Check if the app is offline.
    if std::env::var("TAURI_OFFLINE").is_ok() {
        return false;
    }

    return online::check(None).is_ok();
}

/// Checks if a file exists.
/// path: The path to check.
#[tauri::command]
async fn exists(path: String) -> bool {
    tokio::fs::metadata(path).await.is_ok()
}

/// Saves a file to the local filesystem.
/// path: The path to save the file to.
/// data: The data to save.
#[tauri::command]
async fn save_file(path: String, data: String) {
    // Check if the file exists.
    if exists(path.clone()).await {
        return;
    }

    let mut file = wrap(File::create(path).await, "file");
    let binary_data = general_purpose::STANDARD.decode(data).unwrap();
    file.write_all(&binary_data).await.unwrap();
}

/// Gets a file from the local filesystem.
/// path: The path to get the file from.
/// data: The data to save.
#[tauri::command]
async fn get_file(path: String) -> String {
    // Check if the file exists.
    if !exists(path.clone()).await {
        return "".to_string();
    }

    let mut file = wrap(File::open(path).await, "file");
    let mut data = Vec::new();
    wrap(file.read_to_end(&mut data).await, "read");

    general_purpose::STANDARD.encode(&data)
}

/// Creates a directory.
/// path: The path to create the directory at.
#[tauri::command]
async fn create_dir(path: String) {
    if exists(path.clone()).await {
        return;
    }

    wrap(tokio::fs::create_dir(path).await, "create_dir");
}

/// Deletes a file or directory.
/// path: The path to delete.
#[tauri::command]
async fn delete(path: String) {
    if !exists(path.clone()).await {
        return;
    }

    // Check if the path is a file or directory.
    if tokio::fs::metadata(path.clone()).await.unwrap().is_file() {
        wrap(tokio::fs::remove_file(path).await, "delete");
    } else {
        wrap(tokio::fs::remove_dir_all(path).await, "delete");
    }
}

/// Registers the deep link handler.
fn register_deep_link(app: &mut App<Wry>) {
    let handle = app.handle();
    tauri_plugin_deep_link::register(
        "laudiolin", move |request| {
            wrap(handle.get_window("main").unwrap().set_focus(), "focus");
            handle.emit_all("deeplink", request).unwrap();
        },
    ).unwrap();
}
