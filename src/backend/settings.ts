import type {
    UserSettings,
    SearchSettings,
    AudioSettings,
    UISettings,
    SystemSettings
} from "@app/types";
import { connect } from "@backend/social/gateway";

let settings: UserSettings | null = null;
export const defaultSettings: UserSettings = {
    search: {
        accuracy: true,
        engine: "All"
    },
    audio: {
        playback_mode: "Stream",
        audio_quality: "High",
        stream_sync: true
    },
    ui: {
        color_theme: "Dark"
    },
    system: {
        offline: false,
        broadcast_listening: "Everyone",
        presence: "Generic",
        close: "Exit"
    },
    token: ""
};

export const settingsKeys: { [key: string]: string } = {
    "search.accuracy": "Search Accuracy",
    "search.engine": "Preferred Search Engine",
    "audio.playback_mode": "Audio Playback Mode",
    "audio.audio_quality": "Audio Quality",
    "audio.stream_sync": "Force Streaming When Listening Along",
    "ui.color_theme": "Color Theme",
    "system.offline": "Full Offline Support",
    "system.broadcast_listening": "Show What I'm Listening To",
    "system.presence": "Discord Rich Presence Style",
    "system.close": "Close Mode"
};

/**
 * Loads settings from the settings file.
 */
export function reloadSettings(from?: UserSettings | null): void {
    if (!from) {
        // Check if settings exists in the storage.
        const data = exists("settings");
        // Load the settings as JSON.
        settings =
            data == undefined
                ? defaultSettings
                : JSON.parse(get("settings") as string);
    } else settings = from;

    // Check if the settings are undefined.
    if (settings == undefined) settings = defaultSettings;

    // Save the user's authentication token.
    save("user_token", settings?.token ?? "");
    // Set the user's theme.
    setTheme();
}

/**
 * Updates the theme.
 * @param theme The theme to set.
 */
export function setTheme(theme: "Light" | "Dark" = null): void {
    if (theme == null) theme = settings?.ui?.color_theme ?? "Light";

    // Set the theme.
    document
        .getElementsByTagName("html")[0]
        .setAttribute("data-theme", theme.toString().toLowerCase());
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
 * Sets the user's token.
 * @param token The token.
 * @param update Whether to update the client.
 */
export function setToken(token: string, update = true): void {
    let settings = getSettings();
    if (settings == undefined) {
        settings = defaultSettings;
    }

    // Set the token in the settings.
    settings.token = token;
    saveSettings(settings);

    if (update) {
        // Update the client.
        reloadSettings(settings);
        // Reconnect to the gateway.
        connect();
    }
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
    return settings?.search || defaultSettings.search;
}

/**
 * Returns the cached user settings.
 */
export function audio(): AudioSettings {
    return settings?.audio || defaultSettings.audio;
}

/**
 * Returns the cached user settings.
 */
export function ui(): UISettings {
    return settings?.ui || defaultSettings.ui;
}

/**
 * Returns the cached system settings.
 */
export function system(): SystemSettings {
    return settings?.system || defaultSettings.system;
}

/*
 * Local storage utilities.
 */

/**
 * Returns the value of the specified path in local storage.
 * @param path The path to get the value of. (ex. settings.search.accuracy)
 * @param fallback The fallback value to return if the path does not exist.
 */
export function getFromPath(
    path: string,
    fallback: string | null = null
): string | null {
    // Get the correct object.
    const parts = path.split(".");
    const key = parts.pop() as string;
    const obj = parts.reduce((a: any, b) => a[b], settings);

    // Get the value.
    if (obj) return obj[key] ?? fallback;
    else return fallback;
}

/**
 * Saves the specified value to the specified path in local storage.
 * @param path The path to save the value to. (ex. settings.search.accuracy)
 * @param value The value to save.
 */
export function saveFromPath(path: string, value: any = ""): void {
    // Get the correct object.
    const parts = path.split(".");
    const key = parts.pop() as string;
    const obj = parts.reduce((a: any, b) => a[b], settings);

    // Set the value.
    if (obj) {
        obj[key] = value;
        saveSettings(settings as UserSettings);
    }
}

/**
 * Returns the value of the specified key in local storage.
 * @param key The key to get the value of.
 * @param fallback The fallback value to return if the key does not exist.
 */
export function get(
    key: string,
    fallback: string | null = null
): string | null {
    return (localStorage.getItem(key) as string | null) ?? fallback;
}

/**
 * Sets the value of the specified key in local storage.
 * @param key The key to set the value of.
 * @param value The value to set.
 */
export function save(key: string, value: string = ""): void {
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
