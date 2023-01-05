#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#![feature(once_cell)]

use tauri::{Manager, SystemTray, SystemTrayMenu, CustomMenuItem, App, Wry, SystemTrayEvent, AppHandle, WindowEvent, GlobalWindowEvent};
use window_shadows::set_shadow;

use crate::wrapper::{TauriApp, RustErrorPayload};

mod link;
mod audio;
mod handoff;
mod backend;
mod wrapper;
mod discord;
mod settings;

/// Wraps Result instances into an output.
/// Any errors are passed to the frontend.
/// obj: The object to wrap.
pub fn wrap<O, E>(obj: Result<O, E>, code: &str) -> O {
    match obj {
        Ok(output) => output,
        Err(_) => {
            TauriApp::emit("rusterr", RustErrorPayload {
                code: code.to_string()
            });

            panic!("An error occurred in the backend. {}", code);
        }
    }
}

fn main() {
    // Check for an existing deep link instance.
    tauri_plugin_deep_link::prepare("laudiolin");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            handoff::handoff, handoff::open_browser,
            discord::update_presence, discord::clear_presence,
            wrapper::search, wrapper::id_search, wrapper::download,
            settings::read_from_file, settings::get_settings, settings::save_settings,
            audio::make_track, audio::create_audio_payload, audio::play_from, audio::play_playlist, audio::track_exists
        ])
        .setup(|app| {
            // Bind app to once_cell.
            TauriApp::set(app.handle());

            // Initialize backend wrapper.
            wrapper::initialize();
            // Create app data directory.
            create_data_dir(app);
            // Initialize Discord integration.
            discord::initialize();
            // Initialize linking.
            link::initialize(app);

            // Set the window shadow.
            let window = app.get_window("main").unwrap();
            wrap(set_shadow(&window, true), "shadow");

            Ok(())
        })
        .system_tray(configure_system_tray())
        .on_window_event(window_handler)
        .on_system_tray_event(tray_handler)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/// Configures the system tray to be used.
fn configure_system_tray() -> SystemTray {
    // Configure items.
    let quit = CustomMenuItem::new("quit".to_string(), "Exit Laudiolin");
    // Configure menu.
    let menu = SystemTrayMenu::new()
        .add_item(quit);

    return SystemTray::new().with_menu(menu);
}

/// Event listener for when the system tray is clicked.
fn tray_handler(app: &AppHandle<Wry>, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::MenuItemClick { id, .. } => { menu_item_handler(id) }
        SystemTrayEvent::DoubleClick { .. } => {
            app.get_window("main").unwrap().show()
                .expect("Unable to show main window.");
        }
        _ => {}
    }
}

/// Event listener for when a menu item in the tray is clicked.
fn menu_item_handler(id: String) {
    match id.as_str() {
        "quit" => { std::process::exit(0) }
        _ => {}
    }
}

/// Event listener for when the window is interacted with.
fn window_handler(event: GlobalWindowEvent<Wry>) {
    match event.event() {
        WindowEvent::CloseRequested { api, .. } => {
            api.prevent_close();
            event.window().hide().expect("Unable to hide window.");
        }
        _ => {}
    }
}

/// Creates the app data directory.
/// app: The Tauri app.
fn create_data_dir(app: &mut App<Wry>) {
    let data_dir = app.path_resolver().app_data_dir().unwrap();
    if !data_dir.exists() {
        std::fs::create_dir(data_dir).unwrap();
    }

    // Create the downloads folder if needed.
    let downloads_dir = app.path_resolver().app_data_dir().unwrap()
        .join("downloads");
    if !downloads_dir.exists() {
        std::fs::create_dir(downloads_dir).unwrap();
    }
}

/// Checks if a file exists.
/// path: The path to the file.
fn file_exists(path: String) -> bool {
    std::path::Path::new(path.as_str()).exists()
}