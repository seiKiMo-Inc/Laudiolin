import { EventEmitter } from "events";

import type { Page } from "@backend/types";

// The event emitter for navigation.
const navigationEmitter = new EventEmitter();

/**
 * Lets the app know the page should update.
 * @param page The page to navigate to.
 */
export function navigate(page: Page) {
    navigationEmitter.emit("navigate", page);
}

/**
 * Registers the specified listener for navigation events.
 * @param listener The listener to register.
 */
export function registerListener(listener: (page: Page) => void) {
    navigationEmitter.on("navigate", listener);
}

/**
 * Removes the specified listener from navigation events.
 */
export function removeListeners() {
    navigationEmitter.removeAllListeners();
}