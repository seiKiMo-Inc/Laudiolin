use tauri_build::{try_build, Attributes, WindowsAttributes};

fn main() {
    try_build(Attributes::new()
        .windows_attributes(WindowsAttributes::new()
            .window_icon_path("icons/icon.ico"))
    ).expect("Unable to build Tauri application.");
}
