#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[allow(unused_imports)]

mod proxy;

use tauri::{Manager, App, Wry, CustomMenuItem, AppHandle, Window, WindowBuilder, WindowUrl};
use tauri::{SystemTray, SystemTrayMenu, SystemTrayEvent};
use window_shadows::set_shadow;
use tokio::fs::File;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use base64::{Engine as _, engine::general_purpose};
use portpicker::{is_free, pick_unused_port};
use tauri::utils::config::AppUrl;

#[cfg(target_os = "windows")]
use windows::Win32::Foundation::HWND;
#[cfg(target_os = "windows")]
use windows::Win32::UI::WindowsAndMessaging::*;

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
    // TODO: Open main app instance.
    tauri_plugin_deep_link::prepare("moe.seikimo.laudiolin");

    let mut context = tauri::generate_context!();
    let mut builder = tauri::Builder::default();
    let mut window_url = WindowUrl::App("index.html".into());

    #[cfg(not(dev))]
    {
        let mut port = 5824;
        if !is_free(port) {
            port = pick_unused_port().expect("Unable to find an unused port.");
        }

        let url = format!("http://localhost:{}/", port).parse().unwrap();
        window_url = WindowUrl::External(url);
        context.config_mut().build.dist_dir = AppUrl::Url(window_url.clone());
        context.config_mut().build.dev_path = AppUrl::Url(window_url.clone());

        builder = builder.plugin(tauri_plugin_localhost::Builder::new(port).build())
    }

    builder
        .invoke_handler(tauri::generate_handler![
            open, online, exists, save_file, get_file, create_dir, delete, open_dev_tools, move_to_bottom
        ])
        .setup(|app| {
            // Initialize deep linking.
            register_deep_link(app);

            // Create the window.
            let mut window_builder = WindowBuilder::new(
                app, "main", window_url)
                .maximized(false)
                .resizable(true)
                .decorations(false)
                .transparent(true)
                .center()
                .inner_size(1224f64, 768f64)
                .min_inner_size(1200f64, 600f64);

            if cfg!(target_os = "windows") && cfg!(debug_assertions) {
                window_builder = window_builder.additional_browser_args(
                    "--disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection --remote-debugging-port=9229"
                );
            }

            // Set the window shadow.
            let window = window_builder.build()
                .expect("Unable to build window.");
            wrap(set_shadow(&window, true), "shadow");

            // Start the image proxy.
            proxy::start_proxy();

            Ok(())
        })
        .system_tray(configure_system_tray())
        .on_system_tray_event(tray_handler)
        .run(context)
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

/// Opens the frontend's developer tools.
#[tauri::command]
fn open_dev_tools(window: Window) {
    window.open_devtools();
}

/// Moves the window object to the "bottom".
/// window: The window to relocate.
#[tauri::command]
fn move_to_bottom(window: Window) {
    move_bottom(window);
}

#[cfg(target_os = "windows")]
fn move_bottom(window: Window) {
    let raw_handle = window.hwnd()
        .expect("Unable to get the Win32 handle.");
    let window_handle = HWND(raw_handle.0);

    unsafe {
        SetWindowPos(
            window_handle,
            HWND_BOTTOM,
            0, 0, 0, 0,
            SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE,
        ).expect("Unable to set window position.");
    }
}

#[cfg(target_os = "macos")]
fn move_bottom(window: Window) {
    todo!("This feature is not supported on macOS.");
}

/// Registers the deep link handler.
#[cfg(target_os = "windows")]
fn register_deep_link(app: &mut App<Wry>) {
    let handle = app.handle();
    tauri_plugin_deep_link::register(
        "laudiolin", move |request| {
            wrap(handle.get_window("main").unwrap().set_focus(), "focus");
            handle.emit_all("deeplink", request).unwrap();
        },
    ).unwrap();
}

#[cfg(target_os = "macos")]
fn register_deep_link(app: &mut App<Wry>) {
    let handle = app.handle();
    tauri_plugin_deep_link::register(
        "moe.seikimo.laudiolin", "laudiolin", move |request| {
            wrap(handle.get_window("main").unwrap().set_focus(), "focus");
            handle.emit_all("deeplink", request).unwrap();
        },
    ).unwrap();
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
            let main_window = app.get_window("main").unwrap();
            main_window.show()
                .expect("Unable to show main window.");
            main_window.set_focus()
                .expect("Unable to focus main window.");
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
