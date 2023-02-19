import type { TrackData } from "@backend/types";

import { isListeningWith, listenWith } from "@backend/social";
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
        emitter.emit("download");
        // TODO: Send a notification.
        // await notify({
        //     type: "info",
        //     message: `Finished downloading ${track.title}`,
        //     date: new Date(),
        //     icon: "file-download",
        //     onPress: dismiss
        // });
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

    // Add the track to the player.
    TrackPlayer.add(track);
    // Play the track if specified.
    play && await TrackPlayer.play(null, force);

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
