import { targetRoute, playlists, token } from "@backend/user";
import type { TrackData, Playlist } from "@backend/types";

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
export function fetchPlaylist(id: string, playlists: Playlist[] | null = null): Playlist | null {
    return (playlists ?? fetchAllPlaylists())
        .find(playlist => playlist.id == id) ?? null;
}

/**
 * Fetches a track in a playlist by its ID.
 * @param playlist The playlist to search in.
 * @param id The ID of the track.
 */
export function fetchTrack(playlist: Playlist, id: string): TrackData | null {
    return playlist.tracks.find(track => track.id == id) ?? null;
}

/**
 * Fetches the playlist with the ID from the backend.
 * @param playlistId The ID of the playlist.
 * @return The playlist, or null if it could not be found.
 */
export async function getPlaylistById(playlistId: string): Promise<Playlist|null> {
    const route = `${targetRoute}/playlist/${playlistId}`;
    const response = await fetch(route, {
        method: "GET", headers: { Authorization: token() }
    });

    // Check the response code.
    if (response.status != 301) {
        console.error(`Failed to get playlist data from the backend. Status code: ${response.status}`); return null;
    }

    return (await response.json()) as Playlist;
}