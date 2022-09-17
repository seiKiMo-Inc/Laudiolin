import type { FilePayload } from "@backend/types";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { appDir, sep } from "@tauri-apps/api/path";

let dataDirectory: string | null = null;

/**
 * Initializes the file system frontend handler.
 */
export async function initialize() {
    // Get the data directory.
    dataDirectory = await appDir();
}

/**
 * Returns the file path of the file.
 * @param payload The payload.
 */
export function file(payload: FilePayload): string {
    return convertFileSrc(payload.file_path.replace(/\\"/g, '"'));
}

/**
 * Returns the absolute path to a file in the data directory.
 * @param path The path to the file.
 */
export function data(path: string): string {
    return `${dataDirectory}${sep}${path}`;
}
