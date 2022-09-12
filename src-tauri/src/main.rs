#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#![feature(once_cell)]

use tauri::{Manager, App, Wry};
use window_shadows::set_shadow;

mod backend;
mod wrapper;
mod audio;

#[tauri::command]
fn greet(name: &str) -> String {
    // Download audio file.
    let file = wrapper::download("YuEl6hHwMMI", "YouTube");
    // Play audio file.
    audio::play_audio(file);

    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,

            wrapper::search, wrapper::download
        ])
        .setup(|app| {
            // Bind app to once_cell.
            wrapper::TauriApp::set(app.handle());

            // Initialize backend wrapper.
            wrapper::initialize();
            // Create app data directory.
            create_data_dir(app);

            // Set the window shadow.
            let window = app.get_window("main").unwrap();
            set_shadow(&window, true).expect("Unsupported platform!");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/// Creates the app data directory.
/// app: The Tauri app.
fn create_data_dir(app: &mut App<Wry>) {
    let data_dir = app.path_resolver().app_dir().unwrap();
    if !data_dir.exists() {
        std::fs::create_dir(data_dir).unwrap();
    }
}