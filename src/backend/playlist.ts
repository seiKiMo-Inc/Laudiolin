import { playlists } from "@backend/user";
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
 */
export function fetchPlaylist(id: string): Playlist | null {
    return playlists.find(playlist => playlist.id == id) ?? null;
}

/**
 * Fetches a track in a playlist by its ID.
 * @param playlist The playlist to search in.
 * @param id The ID of the track.
 */
export function fetchTrack(playlist: Playlist, id: string): TrackData | null {
    return playlist.tracks.find(track => track.id == id) ?? null;
}