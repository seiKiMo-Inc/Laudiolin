import type { TrackData } from "@backend/types";

import * as nfs from "@tauri-apps/api/fs";
import { invoke } from "@tauri-apps/api";
import { appDataDir } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";

import { Base64 } from "js-base64";

export let DocumentDirectoryPath: string | null = null;
export const AppData = () => DocumentDirectoryPath;

/*
 * Async wrappers for the filesystem.
 */
const fs = {
    exists: async (path: string): Promise<boolean> =>
        await invoke("exists", { path }),
    createDir: async (path: string): Promise<void> =>
        await invoke("create_dir", { path }),
    removeDir: async (path: string): Promise<void> =>
        await invoke("delete", { path }),
    readTextFile: async (path: string): Promise<string> =>
        atob(await invoke("get_file", { path })),
    writeTextFile: async (path: string, data: string): Promise<void> =>
        await invoke("save_file", { path, data: Base64.encode(data) }),
    writeBinaryFile: async (path: string, data: ArrayBuffer): Promise<void> =>
        await invoke("save_file", {
            path,
            data: Base64.fromUint8Array(new Uint8Array(data))
        })
};

/**
 * Sets up the file system.
 */
export async function setup(): Promise<void> {
    DocumentDirectoryPath = (await appDataDir()).slice(0, -1);
}

/**
 * Creates the folders needed for Laudiolin.
 */
export async function createFolders(): Promise<void> {
    if (!(await fs.exists(DocumentDirectoryPath)))
        await fs.createDir(DocumentDirectoryPath);
    if (!(await fs.exists(`${DocumentDirectoryPath}/tracks`)))
        await fs.createDir(`${DocumentDirectoryPath}/tracks`);
    if (!(await fs.exists(`${DocumentDirectoryPath}/playlists`)))
        await fs.createDir(`${DocumentDirectoryPath}/playlists`);
}

/**
 * Creates the folder for a track.
 * @param track A track data object.
 */
export async function createTrackFolder(track: TrackData): Promise<void> {
    await fs.createDir(`${DocumentDirectoryPath}/tracks/${track.id}`);
}

/**
 * Deletes the folder for a track.
 * @param track A track data object.
 */
export async function deleteTrackFolder(
    track: TrackData | { id: string }
): Promise<void> {
    await fs.removeDir(`${DocumentDirectoryPath}/tracks/${track.id}`);
}

/**
 * Standardized way to get the file path for a track.
 * @param track A track data object.
 */
export function getTrackPath(track: TrackData | { id: string }): string {
    return `${DocumentDirectoryPath}/tracks/${track.id}/audio.mp3`;
}

/**
 * Standardized way to get the file path for a track's icon.
 * @param track A track data object.
 */
export function getIconPath(track: TrackData | { id: string }): string {
    return `${DocumentDirectoryPath}/tracks/${track.id}/icon.png`;
}

/**
 * Standardized way to get the file path for a track's data.
 * @param track A track data object.
 */
export function getDataPath(track: TrackData | { id: string }): string {
    return `${DocumentDirectoryPath}/tracks/${track.id}/data.json`;
}

/**
 * Gets the IDs of all downloaded tracks.
 */
export async function getDownloadedTracks(): Promise<string[]> {
    const files = await nfs.readDir(`${DocumentDirectoryPath}/tracks`);
    return files.map((file) => file.name);
}

/**
 * Loads a track's data from the file system.
 * @param trackId The ID of the track to load.
 */
export async function loadLocalTrackData(trackId: string): Promise<TrackData> {
    return JSON.parse(
        await fs.readTextFile(
            `${DocumentDirectoryPath}/tracks/${trackId}/data.json`
        )
    );
}

/**
 * Checks if the files needed for a track to load exist.
 * @param track A track data object.
 */
export async function trackExists(
    track: TrackData | { id: string }
): Promise<boolean> {
    return (
        (await fs.exists(getTrackPath(track))) &&
        (await fs.exists(getIconPath(track))) &&
        (await fs.exists(getDataPath(track)))
    );
}

/**
 * Downloads the content from the URL and saves it to the file system.
 * @param url The URL to download from.
 * @param path The path to save the file to.
 * @return The download result.
 */
export async function downloadUrl(url: string, path: string): Promise<void> {
    // Fetch the file.
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download file from ${url}.`);

    // Save the file.
    const data = await response.arrayBuffer();
    return await fs.writeBinaryFile(path, data);
}

/**
 * Reads the data from the file system.
 * @param path The path to read the file from.
 * @return The data read from the file. Null if the file doesn't exist.
 */
export async function readData(path: string): Promise<any | null> {
    if (!(await fs.exists(path))) return null; // File doesn't exist.
    return JSON.parse(await fs.readTextFile(path)); // File exists.
}

/**
 * Writes the data to the file system.
 * @param data The data to write.
 * @param path The path to save the file to.
 */
export async function saveData(data: any, path: string): Promise<void> {
    return fs.writeTextFile(path, JSON.stringify(data));
}

/**
 * Converts a file path to a URL.
 * @param path The path to convert.
 */
export function toAsset(path: string): string {
    return convertFileSrc(path);
}
