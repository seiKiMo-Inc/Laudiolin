import * as settings from "./settings";
import type { Playlist, User, TrackData } from "./types";
import { getSettings, saveSettings } from "./settings";

let targetRoute = ``; // The base address for the backend.
export let userData: User | null = undefined; // The loaded user data.
export let playlists: Playlist[] = []; // The loaded playlist data.
export let favorites: TrackData[] = []; // The loaded favorite tracks.

/**
 * Gets the authorization token from the local storage.
 */
function token() {
    return settings.get("user_token", "");
}

/**
 * Loads the target route from the config.
 */
export function loadRoute() {
    const config = settings.gateway();
    targetRoute = `${config.encrypted ? "https" : "http"}://${config.address}:${config.port}`;
}

/**
 * Attempts to get user data from the backend.
 * @param loadData Whether to load the user data.
 */
export async function login(loadData: boolean = true) {
    const route = `${targetRoute}/user`;
    const response = await fetch(route, {
        method: "GET", headers: { Authorization: token() }
    });

    // Check the response code.
    if (response.status != 301) {
        console.error(`Failed to get user data from the backend. Status code: ${response.status}`); return;
    }

    userData = await response.json(); // Load the data into the user data variable.
    console.debug("User data has been loaded."); // Log the success.

    if (loadData) {
        await loadPlaylists(); // Load the playlists.
    }
}

/**
 * Clears the user data.
 */
export async function logout() {
    userData = null; // Clear the user data.
    playlists = []; // Clear the playlist data.
    favorites = []; // Clear the favorite tracks.

    // Remove the authorization code.
    const settings = getSettings();
    settings.token = "";
    await saveSettings(settings);
}

/**
 * Loads playlists from the backend.
 */
export async function loadPlaylists() {
    if (!userData) return; // Check if the user data has been loaded.
    playlists = []; // Reset the playlist array.

    const route = `${targetRoute}/playlist`;
    // Loop through the user's playlists.
    for (const playlistId in userData.playlists) {
        const response = await fetch(`${route}/${playlistId}`, {
            method: "GET", headers: { Authorization: token() }
        });

        // Check the response code.
        if (response.status != 301) {
            console.error(`Failed to get playlist data from the backend. Status code: ${response.status}`); return;
        }

        playlists.push(await response.json()); // Load the data into the playlist array.
    }

    console.debug(`Loaded ${playlists.length} playlists.`); // Log the success.
}

/**
 * Loads favorite tracks from the backend.
 */
export async function loadFavorites() {
    // TODO: Load favorite tracks.
}

/*
 * Utility methods.
 */

/**
 * Gets the user's ID. (Discord)
 * Returns an empty string if the user data has not been loaded.
 */
export function getUserId(): string {
    return userData ? userData.userId : "";
}

/**
 * Gets the user's avatar. (Discord)
 * Returns an empty string if the user data has not been loaded.
 */
export function getAvatar(): string {
    return userData ? userData.avatar : "";
}