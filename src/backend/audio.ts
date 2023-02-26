import type { Playlist, TrackData } from "@backend/types";

import * as settings from "@backend/settings";
import { isListeningWith, listeningWith, listenWith } from "@backend/social";
import { setCurrentPlaylist } from "@backend/playlist";
import { getDownloadUrl, getStreamingUrl } from "@backend/gateway";
import { getIconUrl, savePlayerState } from "@app/utils";

import TrackPlayer from "@mod/player";

/**
 * Sets up the audio player.
 */
export async function setup(): Promise<void> {
    // Add an alternate track loader.
    // Used for loading cached tracks.
    TrackPlayer.alternate = async (track: TrackData) => {
        // Set the remote URLs.
        if (listeningWith != null && settings.audio().stream_sync)
            track.url = getStreamingUrl(track);
        else
            track.url =
                settings.audio().playback_mode == "Download"
                    ? getDownloadUrl(track)
                    : getStreamingUrl(track);
        track.icon = getIconUrl(track);
        return track;
    };

    // Load the volume from the local storage.
    Howler.volume(parseFloat(settings.get("volume", "1")));
}

/**
 * Removes the specified track from the queue.
 * @param track The track to remove.
 */
export function deQueue(track: TrackData): void {
    TrackPlayer.queue = TrackPlayer.queue.filter((t) => t.id != track.id);
    TrackPlayer.emit("queue");
}

/**
 * Adds the specified track to the queue.
 * Plays the track if specified.
 * @param track The track to add.
 * @param play Should the track be played?
 * @param force Should this track be played now?
 * @param local Is this track local?
 * @param fromPlaylist Is this track from a playlist?
 * @param fromHost Is this track from the host?
 */
export async function playTrack(
    track: TrackData,
    play = true,
    force = false,
    local = false,
    fromPlaylist = false,
    fromHost = false
): Promise<void> {
    // Reset the listening state.
    if (isListeningWith() && !fromHost) {
        await listenWith(null);
    }

    // Play the track if specified.
    await TrackPlayer.play(track, force, true, play);

    // Reset the current playlist.
    !fromPlaylist && setCurrentPlaylist(null);
    // Save the player state.
    savePlayerState();
}

/**
 * Shuffles the player queue.
 */
export async function shuffleQueue(): Promise<void> {
    // Shuffle the queue.
    TrackPlayer.shuffle();
    // Skip to the next track.
    await TrackPlayer.next();
}

/**
 * Toggles the repeat state of the player.
 */
export async function toggleRepeatState(): Promise<void> {
    // Get the current repeat state.
    const state = TrackPlayer.getRepeatMode();

    // Set the repeat state.
    switch (state) {
        case "none":
            await TrackPlayer.setRepeatMode("queue");
            break;
        case "queue":
            await TrackPlayer.setRepeatMode("track");
            break;
        case "track":
            await TrackPlayer.setRepeatMode("none");
            break;
    }
}

/**
 * Syncs the current player to the specified track.
 * @param track The track to sync to.
 * @param progress The progress to sync to.
 * @param paused Is the player paused?
 * @param seek Should the player seek?
 */
export async function syncToTrack(
    track: TrackData | null,
    progress: number,
    paused: boolean,
    seek: boolean
): Promise<void> {
    // Reset the player if the track is null.
    if (track == null) {
        await TrackPlayer.reset();
        return;
    }

    // Check if the track needs to be played.
    const playing = TrackPlayer.getCurrentTrack();
    if (playing?.id != track.id) {
        // Play the track.
        await playTrack(track, true, true, false, false, true);
    }

    // Set the progress.
    seek && TrackPlayer.seek(progress);

    // Set the player's state.
    if (paused) {
        TrackPlayer.pause();
    } else {
        await TrackPlayer.play();
    }
}

/**
 * Plays the tracks in the playlist.
 * @param playlist The playlist to play.
 * @param shuffle Should the playlist be shuffled?
 */
export async function playPlaylist(
    playlist: Playlist,
    shuffle: boolean
): Promise<void> {
    // Reset the queue.
    TrackPlayer.reset();

    // Fetch the tracks.
    let tracks = playlist.tracks
        // Remove duplicate tracks.
        .filter((track, index, self) => {
            return self.findIndex((t) => t.id == track.id) == index;
        });
    // Shuffle the tracks.
    shuffle && (tracks = tracks.sort(() => Math.random() - 0.5));
    // Add all tracks in the playlist to the queue.
    for (const track of tracks) {
        await playTrack(track, false, false, false, true);
    }

    // Play the player.
    await TrackPlayer.play();
    // Set the current playlist.
    setCurrentPlaylist(playlist);
}

/**
 * Sets the volume.
 * @param volume The volume to set.
 */
export function setVolume(volume: number): void {
    Howler.volume(volume); // Set the volume of the Howler player.
    settings.save("volume", volume.toString()); // Set the volume in the settings.
}
