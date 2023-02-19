import { EventEmitter } from "events";

import type { Page } from "@backend/types";

// The event emitter for navigation.
const navigationEmitter = new EventEmitter();

/**
 * Lets the app know the page should update.
 * @param page The page to navigate to.
 * @param args The arguments to pass to the page.
 */
export function navigate(page: Page, args?: any) {
    navigationEmitter.emit("navigate", { page, args });
}

/**
 * Registers the specified listener for navigation events.
 * @param listener The listener to register.
 */
export function registerListener(listener: (navigate: { page: Page, args?: any }) => void) {
    navigationEmitter.on("navigate", listener);
}

/**
 * Removes the specified listener from navigation events.
 */
export function removeListeners() {
    navigationEmitter.removeAllListeners();
}
