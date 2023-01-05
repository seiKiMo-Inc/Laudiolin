use tauri::{App, Manager, Wry};

/// Initializes deep linking for the Tauri app.
/// app: The Tauri app.
pub fn initialize(app: &mut App<Wry>) {
    let handle = app.handle();
    tauri_plugin_deep_link::register(
        "laudiolin", move |request| {
            handle.emit_all("deeplink", request).unwrap();
        },
    ).unwrap();
}