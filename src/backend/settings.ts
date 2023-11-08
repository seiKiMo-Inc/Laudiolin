import type {
    UserSettings,
    SearchSettings,
    AudioSettings,
    UISettings,
    SystemSettings
} from "@app/types";

import { connect } from "@backend/social/gateway";
import { useSettings } from "@backend/stores";
import { applyTheme } from "@app/utils";

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
        color_theme: "Dark",
        background_image: null,
        theme: {
            background: {
                primary: "#1A1A1A",
                secondary: "#262626"
            },
            icon: {
                primary: "#ffffff",
                secondary: "#999999"
            },
            text: {
                primary: "#ffffff",
                secondary: "#a6a6a6",
                tertiary: "#999999"
            },
            accent: "#3484fc"
        },
        show_search_engine: true,
        show_elixir: true,
        show_downloads: true,
        show_favorites: true,
        show_recents: true,
        show_home: false
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
    "ui.background_image": "Background Image",
    "ui.theme.background.primary": "Primary Background Color",
    "ui.theme.background.secondary": "Secondary Background Color",
    "ui.theme.icon.primary": "Primary Icon Color",
    "ui.theme.icon.secondary": "Secondary Icon Color",
    "ui.theme.text.primary": "Primary Text Color",
    "ui.theme.text.secondary": "Secondary Text Color",
    "ui.theme.text.tertiary": "Tertiary Text Color",
    "ui.theme.accent": "Accent Color",
    "ui.show_search_engine": "Show Search Engine Dropdown",
    "ui.show_elixir": "Show Elixir Tab",
    "ui.show_downloads": "Show Downloads Tab",
    "ui.show_favorites": "Show Favorites Tab",
    "ui.show_recents": "Show Recents Tab",
    "ui.show_home": "Show Home Tab",
    "system.offline": "Full Offline Support",
    "system.broadcast_listening": "Show What I'm Listening To",
    "system.presence": "Discord Rich Presence Style",
    "system.close": "Close Mode"
};

/**
 * Listen for settings changes.
 */
export function setup(): void {
    useSettings.subscribe((settings) => {
        applyTheme(settings.ui.theme, settings.ui.background_image ? 80 : 100);
    });
}

/**
 * Loads settings from the settings file.
 */
export function reloadSettings(from?: UserSettings | null): void {
    if (!from) {
        // Check if settings exists in the storage.
        const data = exists("settings");
        // Load the settings as JSON.
        useSettings.setState(data == undefined
            ? defaultSettings
            : JSON.parse(get("settings") as string));
    } else useSettings.setState(from);

    // Check if the settings are undefined.
    if (useSettings.getState() == undefined) useSettings.setState(defaultSettings);

    // Save the user's authentication token.
    save("user_token", useSettings.getState()?.token ?? "");
    // Set the user's theme.
    setTheme();
}

/**
 * Updates the theme.
 * @param theme The theme to set.
 */
export function setTheme(theme: "Light" | "Dark" = null): void {
    if (theme == null) theme = useSettings.getState()?.ui?.color_theme ?? "Light";

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
    return useSettings.getState();
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
    return useSettings.getState()?.search || defaultSettings.search;
}

/**
 * Returns the cached user settings.
 */
export function audio(): AudioSettings {
    return useSettings.getState()?.audio || defaultSettings.audio;
}

/**
 * Returns the cached user settings.
 */
export function ui(): UISettings {
    return useSettings.getState()?.ui || defaultSettings.ui;
}

/**
 * Returns the cached system settings.
 */
export function system(): SystemSettings {
    return useSettings.getState()?.system || defaultSettings.system;
}

/*
 * Local storage utilities.
 */

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
