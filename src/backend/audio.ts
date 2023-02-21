import type { Playlist, TrackData } from "@backend/types";

import { isListeningWith, listenWith } from "@backend/social";
import { dismiss, notify } from "@backend/notifications";
import { setCurrentPlaylist } from "@backend/playlist";
import { getStreamingUrl } from "@backend/gateway";
import { getIconUrl } from "@app/utils";
import emitter from "@backend/events";

import * as fs from "@mod/fs";
import TrackPlayer from "@mod/player";

/**
 * Sets up the audio player.
 */
export async function setup(): Promise<void> {
    // Add an alternate track loader.
    // Used for loading cached tracks.
    TrackPlayer.alternate = async (track: TrackData) => {
        if (await fs.trackExists(track))
            // Use the local URLs.
            return await fs.loadLocalTrackData(track.id);

        // Set the remote URLs.
        track.url = getStreamingUrl(track);
        track.icon = getIconUrl(track);
        return track;
    };
}

/**
 * Downloads a track and saves it to the file system.
 * @param track The track to download.
 * @param emit Should the download event be emitted?
 */
export async function downloadTrack(track: TrackData, emit = true): Promise<void> {
    if (await fs.trackExists(track)) {
        return;
    }

    // Create the track's folder.
    await fs.createTrackFolder(track);
    // Download the track data as necessary.
    await fs.downloadUrl(getStreamingUrl(track), fs.getTrackPath(track));
    await fs.downloadUrl(getIconUrl(track), fs.getIconPath(track));
    // Save the track's data.
    track.icon = `file://${fs.getIconPath(track)}`;
    track.url = `file://${fs.getTrackPath(track)}`;
    await fs.saveData(track, fs.getDataPath(track));

    if (emit) {
        // Emit the track downloaded event.
        emitter.emit("download", track);
        // TODO: Send a notification.
        await notify({
            type: "info",
            message: `Finished downloading ${track.title}`,
            date: new Date(),
            icon: "file-download",
            onPress: dismiss
        });
    }
}

/**
 * Deletes a track from the file system.
 * @param track The local track to delete.
 */
export async function deleteTrack(track: TrackData): Promise<void> {
    // Delete the track's folder.
    await fs.deleteTrackFolder(track);

    // Emit the track deleted event.
    emitter.emit("delete");
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
    if (play) {
        await TrackPlayer.play(track, force);
    } else {
        await TrackPlayer.add(track);
    }

    // Reset the current playlist.
    !fromPlaylist && setCurrentPlaylist(null);
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
    track: TrackData|null,
    progress: number,
    paused: boolean,
    seek: boolean
): Promise<void> {
    // Reset the player if the track is null.
    if (track == null) {
        await TrackPlayer.reset(); return;
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
export async function playPlaylist(playlist: Playlist, shuffle: boolean): Promise<void> {
    // Reset the queue.
    TrackPlayer.reset();

    // Fetch the tracks.
    let tracks = playlist.tracks
        // Remove duplicate tracks.
        .filter((track, index, self) => {
            return self.findIndex(t => t.id == track.id) == index;
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
