import { invoke } from "@tauri-apps/api";

import type { UserSettings, SearchSettings, AudioSettings, GatewaySettings, UISettings } from "@backend/types";

let settings: UserSettings | null = null;

/**
 * Loads settings from the settings file.
 */
export async function reloadSettings() {
    // Load the settings from the settings file.
    await invoke("read_from_file", { filePath: "settings.json" });
    // Set settings from backend.
    settings = await invoke("get_settings");
}

/*
 * Settings utilities.
 */

/**
 * Returns the cached user settings.
 * Use {@link #reloadSettings} to update the settings.
 */
export function getSettings(): UserSettings | null {
    return settings;
}

/**
 * Returns the cached user settings.
 */
export function search(): SearchSettings {
    return (
        settings?.search || {
            accuracy: false,
            engine: "all"
        }
    );
}

/**
 * Returns the cached user settings.
 */
export function audio(): AudioSettings {
    return (
        settings?.audio || {
            download_path: "cache"
        }
    );
}

/**
 * Returns the cached user settings.
 */
export function gateway(): GatewaySettings {
    return (
        settings?.gateway || {
            encrypted: true,
            address: "app.magix.lol",
            port: 443,
            gateway_port: 443
        }
    );
}

/**
 * Returns the cached user settings.
 */
export function ui(): UISettings {
    return settings?.ui || <UISettings>{};
}
