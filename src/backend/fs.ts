import type { FilePayload } from "@backend/types";
import { convertFileSrc } from "@tauri-apps/api/tauri";

/**
 * Returns the file path of the file.
 * @param payload The payload.
 */
export function file(payload: FilePayload): string {
    return convertFileSrc(payload.file_path.replace(/\\"/g, '"'));
}