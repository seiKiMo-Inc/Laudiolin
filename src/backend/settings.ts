import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api";
import { data } from "@backend/fs";

import type { Event } from "@tauri-apps/api/event";
import type { UserSettings, SearchSettings, AudioSettings, GatewaySettings, UISettings } from "@backend/types";

let settings: UserSettings | null = null;

/**
 * Loads settings from the settings file.
 */
export async function reloadSettings(from: UserSettings | null = null) {
    if (!from) {
        // Load the settings from the settings file.
        await invoke("read_from_file", { filePath: data("settings.json") });
        // Set settings from backend.
        settings = await invoke("get_settings");
    } else settings = from;

    applySystemDarkMode(); // Set dark mode to the system preference.
    save("user_token", settings.token); // Save the user's authentication token.
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
 * Saves the specified settings to the settings file.
 * @param newSettings The settings to save.
 */
export async function saveSettings(newSettings: UserSettings): Promise<void> {
    await invoke("save_settings", { settings: newSettings });
    await reloadSettings(newSettings);
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

/*
 * Local storage utilities.
 */

/**
 * Sets up event listeners.
 */
export async function setupListeners() {
    console.log("Setting up settings event listeners...");
    await listen("save_storage", saveToStorage);
}

/**
 * Applies dark-mode to the page.
 */
function applySystemDarkMode() {
    // Check if dark mode is present.
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.body.classList.add("dark"); // Set dark mode.
    }
}

/**
 * Saves the specified key-value pair to local storage.
 * @param event The event.
 */
function saveToStorage(event: Event<any>) {
    const { key, value } = event.payload;
    localStorage.setItem(key, value);
}

/**
 * Returns the value of the specified key in local storage.
 * @param key The key to get the value of.
 * @param fallback The fallback value to return if the key does not exist.
 */
export function get(key: string, fallback: string | null = null): string | null {
    return localStorage.getItem(key) ?? fallback;
}

/**
 * Sets the value of the specified key in local storage.
 * @param key The key to set the value of.
 * @param value The value to set.
 */
export function save(key: string, value: string): void {
    localStorage.setItem(key, value);
}

/**
 * Removes the specified key from local storage.
 * @param key The key to remove.
 */
export function remove(key: string): void {
    localStorage.removeItem(key);
}

/**
 * Checks if the specified key exists in local storage.
 * @param key The key to check.
 */
export function exists(key: string): boolean {
    return localStorage.getItem(key) !== null;
}
