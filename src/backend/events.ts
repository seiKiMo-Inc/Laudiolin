import { EventEmitter } from "events";
import { Event, listen } from "@tauri-apps/api/event";
import type { RustErrorPayload } from "@backend/types";

const emitter = new EventEmitter();
export default emitter;

/**
 * Sets up listeners for the events emitted by the backend.
 */
export async function setupListeners() {
    await listen("error", onBackendError);
}

/**
 * Handles an error emitted by the backend.
 */
function onBackendError(event: Event<RustErrorPayload>) {
    const payload = event.payload;
    emitter.emit(`rusterr:${payload.code}`, payload.error);
}