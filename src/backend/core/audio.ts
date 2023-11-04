import type { Playlist, TrackData } from "@app/types";

import * as settings from "@backend/settings";
import { isListeningWith, listeningWith, listenWith } from "@backend/features/social";
import { setCurrentPlaylist } from "@backend/core/playlist";
import { getDownloadUrl, getStreamingUrl } from "@backend/social/gateway";
import { base64Encode, getIconUrl, savePlayerState } from "@app/utils";
import { notify } from "@backend/features/notifications";

// #v-ifdef VITE_BUILD_ENV='desktop'
import * as fs from "@backend/desktop/fs";
// #v-endif
import TrackPlayer from "@mod/player";

import { append, useDownloads } from "@backend/stores";

/**
 * Sets up the audio player.
 */
export async function setup(): Promise<void> {
    // Add an alternate track loader.
    // Used for loading cached tracks.
    TrackPlayer.alternate = async (track: TrackData) => {
        // #v-ifdef VITE_BUILD_ENV='desktop'
        if (await fs.trackExists(track))
            // Use the local URLs.
            return await fs.loadLocalTrackData(track.id);
        // #v-endif

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
 * Downloads a track and saves it to the file system.
 * @param track The track to download.
 * @param emit Should the download event be emitted?
 */
export async function downloadTrack(
    track: TrackData,
    emit = true
): Promise<void> {
    // #v-ifdef VITE_BUILD_ENV='desktop'
    if (await fs.trackExists(track)) {
        return;
    }

    // Create the track's folder.
    await fs.createTrackFolder(track);
    // Download the track data as necessary.
    await fs.downloadUrl(getDownloadUrl(track), fs.getTrackPath(track));
    await fs.downloadUrl(getIconUrl(track), fs.getIconPath(track));
    // Save the track's data.
    track.icon = fs.toAsset(fs.getIconPath(track));
    track.url = fs.toAsset(fs.getTrackPath(track));
    track.title = base64Encode(new TextEncoder().encode(track.title));
    track.serialized = true;
    await fs.saveData(track, fs.getDataPath(track));

    if (emit) {
        // Emit the track downloaded event.
        append(useDownloads, track);
        await notify({
            type: "info",
            message: `Finished downloading ${track.title}`
        });
    }
    // #v-endif
}

/**
 * Deletes a track from the file system.
 * @param track The local track to delete.
 */
export async function deleteTrack(track: TrackData): Promise<void> {
    // #v-ifdef VITE_BUILD_ENV='desktop'
    // Delete the track's folder.
    await fs.deleteTrackFolder(track);

    // Emit the track deleted event.

    // #v-endif
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
    TrackPlayer.volume(volume); // Set the volume of the Howler player.
    settings.save("volume", volume.toString()); // Set the volume in the settings.
}
