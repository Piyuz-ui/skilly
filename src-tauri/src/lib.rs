//! Skilly's native app shell (Tauri).
//!
//! The Skilly interface (the same React app as the website, built into
//! ../dist) runs inside a native window on macOS, Windows and Linux, and
//! inside the Android and iOS apps. This Rust side owns the window, opens
//! outside links in the person's browser, and is where native features
//! (notifications, files) are added.

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Links to other websites open in the normal browser, not inside the app.
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Skilly");
}
