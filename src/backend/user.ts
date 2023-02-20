import type { User, Playlist, TrackData, PlaylistAuthor } from "@backend/types";

import emitter from "@backend/events";
import { navigate } from "@backend/navigation";
import * as settings from "@backend/settings";

import { Gateway } from "@app/constants";

import { setToken } from "@backend/settings";

export const updateTargetRoute = () => targetRoute = Gateway.getUrl();
export let targetRoute = Gateway.getUrl(); // The base address for the backend.
export let userData: User | null = null; // The loaded user data.
export let playlists: Playlist[] = []; // The loaded playlist data.
export let favorites: TrackData[] = []; // The loaded favorite tracks.
export let recents: TrackData[] = []; // The loaded recent tracks.

/**
 * Data loaders for offline support.
 */
export const loaders = {
    userData: (data: User) => {
        userData = data; // Update the user data.
        emitter.emit("login", data); // Emit the login event.
    },
    playlists: (data: Playlist[]) => {
        playlists = data; // Update the playlist data.
        emitter.emit("playlist", data); // Emit the playlist event.
    },
    favorites: (data: TrackData[]) => favorites = data,
};

/*
 * HTTP request utilities.
 */

/**
 * Returns the URL for logging in.
 */
export function getLoginUrl(): string {
    return `${targetRoute}/discord`
}

/**
 * Gets the authorization token from the local storage.
 */
export function token(): string {
    return settings.get("user_token") ?? "";
}

/**
 * Gets the user ID from the local storage.
 */
export function userId(): string {
    return userData?.userId ?? "";
}

/*
 * Loading data from a token.
 */

/**
 * Attempts to generate a code for the user to authenticate with.
 * @returns The generated code.
 */
export async function getCode(): Promise<string | null> {
    const code = token(); // Get the token.
    if (code == "") return null; // Check if the user is authenticated.

    const route = `${targetRoute}/user/auth`;
    const response = await fetch(route, {
        method: "GET", headers: { Authorization: code }
    });

    // Check the response code.
    if (response.status != 200) {
        console.error(`Failed to get code from the backend. Status code: ${response.status}`);
        return null;
    }

    return (await response.json()).authCode;
}

/**
 * Attempts to get a token from an authentication code.
 * @param code The authentication code.
 * @returns Whether the token was successfully retrieved.
 */
export async function getToken(code: string): Promise<boolean> {
    // Validate the authentication code.
    if (code == "" || code.length != 6 || isNaN(Number(code))) return false;

    const route = `${targetRoute}/user/auth`;
    const response = await fetch(route, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
    });

    // Check the response code.
    if (response.status != 200) {
        console.error(`Failed to get token from the backend. Status code: ${response.status}`);
        return false;
    }

    // Fetch the token from the response.
    const { token } = await response.json();
    // Save the token.
    await setToken(token);

    return true;
}

/**
 * Attempts to get user data from the backend.
 * @param code The user's authentication token.
 * @param loadData Whether to load the user data.
 * @returns True if the user data was successfully loaded.
 */
export async function login(code: string = "", loadData: boolean = true): Promise<boolean> {
    if (code == "") code = token(); // If no code is provided, use the token.
    if (!code || code == "") return false; // If no code is provided, exit.

    const route = `${targetRoute}/user`;
    const response = await fetch(route, {
        method: "GET", headers: { Authorization: code }
    });

    // Check the response code.
    if (response.status != 301) {
        console.error(`Failed to get user data from the backend. Status code: ${response.status}`);
        await logout(); // Log the user out.
        navigate("Login"); // Redirect to the login page.

        return false;
    }

    userData = await response.json(); // Load the data into the user data variable.
    console.info("User data has been loaded."); // Log the success.

    // Emit the login event.
    emitter.emit("login", userData);

    if (loadData) {
        loadRecents() // Load recent tracks.
            .catch(err => console.error(err));
        loadPlaylists() // Load the playlists.
            .catch(err => console.error(err));
        loadFavorites() // Load favorite tracks.
            .catch(err => console.error(err));
    }

    return true;
}

/**
 * Clears the user data.
 */
export function logout() {
    userData = null; // Clear the user data.
    playlists = []; // Clear the playlist data.
    favorites = []; // Clear the favorite tracks.

    // Remove the authorization code.
    const newSettings = settings.getSettings() ?? settings.defaultSettings;
    newSettings.token = "";
    settings.saveSettings(newSettings);

    // Set the user as logged out.
    settings.remove("user_token");
    settings.remove("authenticated");

    // Emit the logout event.
    emitter.emit("logout");

    // Send the user to the login page.
    navigate("Login");
}

/**
 * Loads playlists from the backend.
 */
export async function loadPlaylists() {
    if (!userData) return; // Check if the user data has been loaded.
    if (!userData.playlists) return; // Check if the user has any playlists.
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

    // Remove duplicate playlists.
    playlists = playlists.filter((playlist, index, self) =>
        self.findIndex(p => p.id == playlist.id) == index);

    emitter.emit("playlist", playlists); // Emit the 'playlist' event.
    console.info(`Loaded ${playlists.length} playlists.`); // Log the success.
}

/**
 * Loads favorite tracks from the backend.
 */
export async function loadFavorites() {
    if (!userData) return; // Check if the user data has been loaded.
    if (!userData.likedSongs) return; // Check if the user has any favorites.
    favorites = userData.likedSongs; // Load the favorites.

    console.info(`Loaded ${favorites.length} favorite tracks.`); // Log the success.
}

/**
 * Loads recent tracks from the backend.
 * @param tracks The recent tracks to load. (gateway)
 */
export async function loadRecents(tracks: TrackData[]|null = null) {
    if (tracks) {
        recents = tracks; // Load the recents from the gateway.
        return;
    }

    if (!userData) return; // Check if the user data has been loaded.
    if (!userData.recentlyPlayed) return; // Check if the user has any recents.
    recents = userData.recentlyPlayed; // Load the recents.

    console.info(`Loaded ${recents.length} recent tracks.`); // Log the success.
}

/*
 * Utility methods.
 */

/**
 * Gets the user's ID. (Discord)
 * Returns an empty string if the user data has not been loaded.
 */
export function getUserId(): string {
    return userData ? userData?.userId ?? "" : "";
}

/**
 * Gets the user's avatar. (Discord)
 * Returns an empty string if the user data has not been loaded.
 */
export function getAvatar(): string {
    return userData ? userData.avatar ?? "" : "";
}

/**
 * Creates a local-playlist from the given data.
 * @param id The playlist's ID.
 * @param name The playlist's name.
 * @param icon The playlist's icon.
 * @param description The playlist's description.
 * @param tracks The playlist's tracks.
 */
export function makePlaylist(
    id: string,
    name: string,
    icon: string,
    description: string,
    tracks: TrackData[],
): Playlist {
    return {
        owner: userId(),
        id, name, icon, description,
        isPrivate: false, tracks
    };
}

/**
 * Returns the author of a playlist.
 * @param playlist The playlist to get the author of.
 */
export async function getPlaylistAuthor(playlist: Playlist): Promise<PlaylistAuthor> {
    const owner = playlist.owner ?? ""; // Get the owner's ID.
    if (owner == "") return { name: "Unknown", icon: "" }; // If no owner is provided, return "Unknown".

    // If the owner is the current user, return the user's username & icon.
    if (owner == getUserId()) return {
        name: `${userData?.username}#${userData?.discriminator}`,
        icon: userData?.avatar ?? ""
    };

    // Otherwise, load the owner's data.
    const user = await getUserById(owner);
    if (!user) return { name: "Unknown", icon: "" }; // If the user data could not be loaded, return "Unknown".

    return { // Return the user's username & icon.
        name: `${user.username}#${user.discriminator}`,
        icon: user.avatar ?? ""
    };
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
 * Adds a favorite track on the backend.
 * @param track The track to add.
 * @param add Whether to add or remove the track.
 */
export async function favoriteTrack(track: TrackData, add: boolean = true): Promise<boolean> {
    const route = `${targetRoute}/user/favorite`;
    const response = await fetch(route, {
        method: "POST", headers: {
            Operation: add ? "add" : "remove",
            Authorization: token(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(track)
    });

    if (response.status != 200) {
        console.error(`Failed to ${add ? "add" : "remove"} favorite track. Status code: ${response.status}`); return false;
    }

    // Update the favorites array.
    favorites = await response.json();
    emitter.emit("favorites");

    return true;
}

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
    playlists = playlists.filter(playlist => playlist.id != playlistId); // Remove the playlist from the array.
    const route = `${targetRoute}/playlist/${playlistId}`;
    const response = await fetch(route, {
        method: "DELETE", headers: { Authorization: token() }
    });

    return response.status == 200;
}
