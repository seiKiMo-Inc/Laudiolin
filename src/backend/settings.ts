import type { UserSettings, SearchSettings, AudioSettings, GatewaySettings, UISettings } from "@backend/types";

let settings: UserSettings | null = null;
const defaultSettings: UserSettings = {
    search: {
        accuracy: true,
        engine: "All"
    },
    audio: {

    },
    gateway: {
        encrypted: true,
        address: "app.magix.lol",
        port: 443,
        gateway_port: 443
    },
    ui: {
        background_color: "",
        background_url: ""
    },
    token: ""
};

/**
 * Loads settings from the settings file.
 */
export function reloadSettings(from?: UserSettings | null) {
    if (!from) {
        settings = JSON.parse(get("settings", JSON.stringify(defaultSettings)));
    } else settings = from;

    // applySystemDarkMode(); // Set dark mode to the system preference.
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
export function saveSettings(newSettings: UserSettings): void {
    save("settings", JSON.stringify(newSettings));
    reloadSettings(newSettings);
}

/**
 * Returns the cached user settings.
 */
export function search(): SearchSettings {
    return (
        settings?.search || {
            accuracy: false,
            engine: "All"
        }
    );
}

/**
 * Returns the cached user settings.
 */
export function audio(): AudioSettings {
    return settings?.audio || {};
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
