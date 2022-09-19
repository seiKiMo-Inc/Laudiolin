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
mod settings;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            wrapper::search, wrapper::download,
            audio::make_track, audio::play_from, audio::play_playlist,
            settings::read_from_file, settings::get_settings, settings::save_settings
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