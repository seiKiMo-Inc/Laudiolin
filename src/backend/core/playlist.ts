import type { TrackData, Playlist } from "@app/types";

import { targetRoute, playlists, token } from "@backend/social/user";

export let currentPlaylist: Playlist | null = null;

/*
 * Current playlist management.
 */

/**
 * Sets the current playlist.
 * @param playlist The playlist to set.
 */
export function setCurrentPlaylist(playlist: Playlist | null): void {
    currentPlaylist = playlist;
}

/**
 * Fetches all loaded playlists.
 */
export function fetchAllPlaylists(): Playlist[] {
    return playlists;
}

/**
 * Fetches a playlist by its ID.
 * @param id The ID of the playlist.
 * @param playlists The playlists to search through.
 */
export async function fetchPlaylist(
    id: string,
    playlists: Playlist[] | null = null
): Promise<Playlist | null> {
    return (
        (playlists ?? fetchAllPlaylists()).find(
            (playlist) => playlist.id == id
        ) ?? await getPlaylistById(id)
    );
}

/**
 * Fetches a track in a playlist by its ID.
 * @param playlist The playlist to search in.
 * @param id The ID of the track.
 */
export function fetchTrack(playlist: Playlist, id: string): TrackData | null {
    return playlist.tracks.find((track) => track.id == id) ?? null;
}

/*
 * Playlist management.
 */

/**
 * Fetches the playlist with the ID from the backend.
 * @param playlistId The ID of the playlist.
 * @return The playlist, or null if it could not be found.
 */
export async function getPlaylistById(
    playlistId: string
): Promise<Playlist | null> {
    const route = `${targetRoute}/playlist/${playlistId}`;
    const response = await fetch(route, {
        method: "GET",
        headers: { Authorization: token() },
        cache: "no-cache"
    });

    // Check the response code.
    if (response.status != 301) {
        console.error(
            `Failed to get playlist data from the backend. Status code: ${response.status}`
        );
        return null;
    }

    return (await response.json()) as Playlist;
}

/**
 * Changes the playlist's name.
 * @param playlistId The ID of the playlist.
 * @param name The new name of the playlist.
 */
export async function renamePlaylist(
    playlistId: string,
    name: string
): Promise<boolean> {
    const response = await fetch(
        `${targetRoute}/playlist/${playlistId}?type=rename`,
        {
            method: "PATCH",
            headers: {
                Authorization: token(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name })
        }
    );

    return response.status != 200;
}

/**
 * Changes the playlist's description.
 * @param playlistId The ID of the playlist.
 * @param description The new description of the playlist.
 */
export async function describePlaylist(
    playlistId: string,
    description: string
): Promise<boolean> {
    const response = await fetch(
        `${targetRoute}/playlist/${playlistId}?type=describe`,
        {
            method: "PATCH",
            headers: {
                Authorization: token(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ description })
        }
    );

    return response.status != 200;
}

/**
 * Changes the playlist's icon.
 * @param playlistId The ID of the playlist.
 * @param icon The new icon URl of the playlist.
 */
export async function setPlaylistIcon(
    playlistId: string,
    icon: string
): Promise<boolean> {
    const response = await fetch(
        `${targetRoute}/playlist/${playlistId}?type=icon`,
        {
            method: "PATCH",
            headers: {
                Authorization: token(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ icon })
        }
    );

    return response.status != 200;
}

/**
 * Changes the playlist's visibility.
 * @param playlistId The ID of the playlist.
 * @param isPrivate Whether the playlist should be private.
 */
export async function setPlaylistVisibility(
    playlistId: string,
    isPrivate: boolean
): Promise<boolean> {
    const response = await fetch(
        `${targetRoute}/playlist/${playlistId}?type=privacy`,
        {
            method: "PATCH",
            headers: {
                Authorization: token(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ isPrivate })
        }
    );

    return response.status != 200;
}

/**
 * Adds a track to the playlist.
 * @param playlistId The ID of the playlist.
 * @param track The track to add.
 */
export async function addTrackToPlaylist(
    playlistId: string,
    track: TrackData
): Promise<boolean> {
    const response = await fetch(
        `${targetRoute}/playlist/${playlistId}?type=add`,
        {
            method: "PATCH",
            headers: {
                Authorization: token(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(track)
        }
    );

    return response.status != 200;
}

/**
 * Removes a track from the playlist.
 * @param playlistId The ID of the playlist.
 * @param index The index of the track to remove.
 */
export async function removeTrackFromPlaylist(
    playlistId: string,
    index: number
): Promise<boolean> {
    const response = await fetch(
        `${targetRoute}/playlist/${playlistId}?type=remove`,
        {
            method: "PATCH",
            headers: {
                Authorization: token(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ index })
        }
    );

    return response.status != 200;
}

/**
 * Sets a playlist's data.
 * @param playlist The playlist to edit.
 */
export async function editPlaylist(playlist: Playlist): Promise<boolean> {
    const response = await fetch(
        `${targetRoute}/playlist/${playlist.id}?type=bulk`,
        {
            method: "PATCH",
            headers: {
                Authorization: token(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(playlist)
        }
    );

    return response.status != 200;
}

/**
 * Imports a playlists from a URL.
 * @param url The URL of the playlist.
 */
export async function importPlaylist(url: string): Promise<Playlist | null> {
    const response = await fetch(`${targetRoute}/playlist/import`, {
        method: "PATCH",
        headers: {
            Authorization: token(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
    });

    return await response.json();
}
