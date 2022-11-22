import emitter from "./events";
import * as settings from "./settings";
import type { Playlist, User, TrackData } from "./types";
import { Pages } from "@app/constants";

export let targetRoute = ``; // The base address for the backend.
export let userData: User | null = undefined; // The loaded user data.
export let playlists: Playlist[] = []; // The loaded playlist data.
export let favorites: TrackData[] = []; // The loaded favorite tracks.

/*
 * HTTP request utilities.
 */

/**
 * Gets the authorization token from the local storage.
 */
export function token() {
    return settings.get("user_token", "");
}

/**
 * Loads the target route from the config.
 */
export function loadRoute() {
    const config = settings.gateway();
    targetRoute = `${config.encrypted ? "https" : "http"}://${config.address}:${config.port}`;
}

/*
 * Loading data from a token.
 */

/**
 * Attempts to get user data from the backend.
 * @param code The user's authentication token.
 * @param loadData Whether to load the user data.
 */
export async function login(code: string = "", loadData: boolean = true) {
    if (code == "") code = token(); // If no code is provided, use the token.

    const route = `${targetRoute}/user`;
    const response = await fetch(route, {
        method: "GET", headers: { Authorization: code }, cache: "no-cache"
    });

    // Check the response code.
    if (response.status != 301) {
        console.error(`Failed to get user data from the backend. Status code: ${response.status}`);
        await logout(); // Log the user out.
        window.location.href = "/login"; // Redirect to the login page.

        return;
    }

    userData = await response.json(); // Load the data into the user data variable.
    console.debug("User data has been loaded."); // Log the success.

    // Emit the login event.
    emitter.emit("login", userData);

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
    const newSettings = settings.getSettings();
    newSettings.token = "";
    await settings.saveSettings(newSettings);

    // Set the user as logged out.
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isGuest");

    // Emit the logout event.
    emitter.emit("logout");

    // send the user to the login page.
    window.location.href = Pages.login;
}

/**
 * Loads playlists from the backend.
 */
export async function loadPlaylists() {
    if (!userData) return; // Check if the user data has been loaded.
    playlists = []; // Reset the playlist array.

    const route = `${targetRoute}/playlist`;
    // Loop through the user's playlists.
    for (const playlistId of userData.playlists) {
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

/*
 * Loading other user data.
 */

/**
 * Loads a user from the backend.
 * @param userId The user's ID.
 */
export async function getUserById(userId: string): Promise<User|null> {
    const route = `${targetRoute}/user/${userId}`;
    const response = await fetch(route, {
        method: "GET", headers: { Authorization: token() }
    });

    // Check the response code.
    if (response.status != 301) {
        console.error(`Failed to get user data from the backend. Status code: ${response.status}`); return null;
    }

    return await response.json(); // Load the data into the user data variable.
}

/**
 * Loads a user's playlists from the backend.
 * @param user The user's data.
 */
export async function getUserPlaylists(user: User): Promise<Playlist[]|null> {
    const route = `${targetRoute}/playlist`;
    const playlists: Playlist[] = []; // The loaded playlists.

    // Loop through the user's playlists.
    for (const playlistId in user.playlists) {
        const response = await fetch(`${route}/${playlistId}`, {
            method: "GET", headers: { Authorization: token() }
        });

        // Check the response code.
        if (response.status != 301) {
            console.error(`Failed to get playlist data from the backend. Status code: ${response.status}`); return null;
        }

        playlists.push(await response.json()); // Load the data into the playlist array.
    }

    return playlists;
}

/*
 * Modifying user data.
 */

/**
 * Creates the playlist on the backend.
 * @param playlist The playlist to create.
 * @return The created playlist, or null if it failed.
 */
export async function createPlaylist(playlist: Playlist): Promise<Playlist|null> {
    const route = `${targetRoute}/playlist/create`;
    const response = await fetch(route, {
        method: "POST", headers: {
            Authorization: token(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(playlist)
    });

    if (response.status != 201) {
        console.error(`Failed to create playlist. Status code: ${response.status}`); return null;
    }

    return await response.json();
}

/**
 * Deletes a playlist.
 * @param playlistId The playlist's ID.
 */
export async function deletePlaylist(playlistId: string): Promise<boolean> {
    const route = `${targetRoute}/playlist/${playlistId}`;
    const response = await fetch(route, {
        method: "DELETE", headers: { Authorization: token() }
    });

    return response.status == 200;
}