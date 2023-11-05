import type { TrackData } from "@app/types";

import { Gateway } from "@app/constants";
import { playTrack, toggleRepeatState } from "@backend/core/audio";
import * as settings from "@backend/settings";

import * as fs from "@backend/desktop/fs";
import TrackPlayer from "@mod/player";
import emitter from "@backend/events";
import { router } from "@app/main";
import { contentRoutes } from "@app/constants";
import { asArray, useFavorites } from "@backend/stores";

/**
 * Matches the icon URL to the correct proxy URL.
 * @param track The track to get the icon URL for.
 */
export function getIconUrl(track: TrackData): string {
    let icon = track.icon;
    // Replace the legacy icon URL.
    if (icon.includes("app.magix.lol"))
        icon = icon.replace("app.magix.lol", "app.seikimo.moe");
    // Check if the icon is already a proxy.
    if (icon.includes("/proxy/")) return icon;
    // Check if the icon is a local image.
    if (icon.includes("asset.localhost"))
        return fs.toAsset(fs.getIconPath(track));
    // Check if the icon is blank.
    if (icon == "") return fs.toAsset(fs.getIconPath(track));

    let url = `${Gateway.getUrl()}/proxy/{ico}?from={src}`;
    // Match the icon URL to the correct proxy URL.
    const iconUrl = track.icon;
    let split = iconUrl.split("/");

    if (iconUrl.includes("i.ytimg.com")) {
        return url.replace("{ico}", split[4]).replace("{src}", "yt");
    }
    if (iconUrl.includes("i.scdn.co")) {
        return url.replace("{ico}", split[4]).replace("{src}", "spot");
    }
    if (iconUrl.includes("lh3.googleusercontent.com")) {
        return url.replace("{ico}", split[3]).replace("{src}", "cart");
    }

    console.warn(`Encountered a weird icon URL! ${icon}`);
    return url;
}

/**
 * Matches the track's URL to the correct source URL.
 *
 * @param track The track to get the source URL for.
 */
export function getTrackSource(track: TrackData): string {
    let url = track.url;

    // Replace the legacy track URL.
    if (url.includes("app.magix.lol"))
        url = url.replace("app.magix.lol", "app.seikimo.moe");
    // Check if the URL is the backend.
    if (url.includes("app.seikimo.moe") ||
        url.includes("download") ||
        url.includes("stream")) {
        // Determine the search engine.
        url = sourceUrl(track.id);
    }

    return url;
}

/**
 * Determines the URL to use for sourcing.
 *
 * @param id The ID of the track.
 */
export function sourceUrl(id: string): string {
    switch (id.length) {
        case 11:
            return `https://youtube.com/watch?v=${id}`;
        case 12:
        case 22:
            return `https://open.spotify.com/track/${id}`;
    }

    return id;
}

/**
 * Formats the duration into hh:mm:ss.
 * @param seconds The duration in seconds.
 */
export function formatDuration(seconds: number): string {
    const date = new Date(seconds * 1000);
    let hh = date.getUTCHours();
    let mm = date.getUTCMinutes();
    const ss = date.getSeconds().toString().padStart(2, "0");

    if (hh) {
        return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    } else {
        return `${mm}:${ss}`;
    }
}

/**
 * Checks if the track is a favorite.
 * @param track The track to check.
 */
export function isFavorite(track: TrackData | null): boolean {
    return track ? asArray(useFavorites).find((t) => t.id == track?.id) != null : false;
}

/**
 * Saves the current player state to the local storage.
 */
export function savePlayerState(): void {
    // Get the current track.
    const track = TrackPlayer.getCurrentTrack()?.data;

    // Check if the track is valid.
    if (track)
        // Save the current track.
        settings.save("player.currentTrack", JSON.stringify(track));
    else
        // Remove the current track.
        settings.remove("player.currentTrack");
}

/**
 * Loads the player state from the local storage.
 */
export async function loadPlayerState(): Promise<void> {
    try {
        // Check if a track is saved.
        const track = settings.get("player.currentTrack");
        // Check if the track is valid.
        if (!track) return;

        // Get the track as a serialized data object.
        const data = JSON.parse(track) as TrackData;
        // Check if the track is valid.
        if (!data) return;

        // Add the track to the queue.
        await playTrack(data, false, false);
    } catch {
        console.warn("Invalid track saved to local storage!");
    }

    // Remove the track from the local storage.
    settings.remove("player.currentTrack");
}

/**
 * Reorders an array.
 * @param list The array to reorder.
 * @param start The start index.
 * @param end The end index.
 */
export function reorder<T>(
    list: T[],
    start: number,
    end: number
): T[] {
    const result = Array.from(list);
    const [removed] = result.splice(start, 1);
    result.splice(end, 0, removed);

    return result;
}

/**
 * Enters or exits mini mode.
 * @param enter Whether to enter or exit mini mode.
 */
export function toMini(enter: boolean): void {
    emitter.emit("miniPlayer", enter);
}

/**
 * Handles hotkeys.
 * @param e The key event.
 */
export async function handleHotKeys(e: KeyboardEvent): Promise<void> {
    if (["INPUT", "TEXTAREA", "SELECT"]
        .includes((e.target as HTMLElement).tagName)) return;

    e.preventDefault();

    if (e.key == (" " || "SpaceBar")) TrackPlayer.pause();
    else if (e.key == "ArrowLeft" && (e.ctrlKey || e.metaKey)) TrackPlayer.back();
    else if (e.key == "ArrowRight" && (e.ctrlKey || e.metaKey)) TrackPlayer.next();
    else if (e.key == "s" && (e.ctrlKey || e.metaKey)) TrackPlayer.shuffle();
    else if (e.key == "l" && (e.ctrlKey || e.metaKey)) await toggleRepeatState();
    else if (e.key == "f" && (e.ctrlKey || e.metaKey)) await this.favorite();
    else if (e.key == "q" && (e.ctrlKey || e.metaKey)) await router.navigate(contentRoutes.QUEUE);
    else if (e.key == "m" && (e.ctrlKey || e.metaKey)) this.toggleMute();
}

/**
 * Fades a component out.
 * @param element The element to fade out.
 * @param duration The duration of the fade.
 */
export function fadeOut(element: HTMLElement, duration: number): void {
    let start = new Date().getTime();
    (function next() {
        let time = new Date().getTime() - start;
        if(time < duration) {
            element.style.opacity = `${1 - time / duration}`;
            requestAnimationFrame(next);
        } else {
            element.style.opacity = '0';
            element.style.display = 'none';
        }
    })();
}

/**
 * Base64-encodes a buffer.
 *
 * @param buffer The buffer to encode.
 */
export function base64Encode(buffer: ArrayBuffer): string {
    let base64 = "";
    const encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

    const bytes = new Uint8Array(buffer);
    const byteLength = bytes.byteLength;
    const byteRemainder = byteLength % 3;
    const mainLength = byteLength - byteRemainder;

    let a, b, c, d;
    let chunk;

    // Main loop deals with bytes in chunks of 3
    for (let i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
        d = chunk & 63               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength];

        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3)   << 4; // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '==';
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

        a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }

    return base64;
}

/**
 * Base64-decodes a string.
 *
 * @param string The string to decode.
 */
export function base64Decode(string: string): ArrayBuffer {
    const encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    let bytes = new Uint8Array(string.length * 0.75);
    let byteLength = 0;

    for (let i = 0; i < string.length; i += 4) {
        let enc1 = encodings.indexOf(string[i]);
        let enc2 = encodings.indexOf(string[i + 1]);
        let enc3 = encodings.indexOf(string[i + 2]);
        let enc4 = encodings.indexOf(string[i + 3]);

        let chr1 = (enc1 << 2) | (enc2 >> 4);
        let chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        let chr3 = ((enc3 & 3) << 6) | enc4;

        bytes[byteLength++] = chr1;

        if (enc3 != 64) bytes[byteLength++] = chr2;
        if (enc4 != 64) bytes[byteLength++] = chr3;
    }

    return bytes.buffer;
}

/**
 * Limits an array to a certain amount of items.
 *
 * @param array The array to limit.
 * @param limit The limit to apply.
 */
export function limitTo<T>(array: T[], limit: number): T[] {
    return array.slice(0, limit);
}
