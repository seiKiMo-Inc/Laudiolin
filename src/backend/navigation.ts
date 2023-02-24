import { EventEmitter } from "events";

import type { Page } from "@backend/types";

// The event emitter for navigation.
const navigationEmitter = new EventEmitter();
let currentPage: Page | null = "Home";
let lastPage: Page[] = [];
let nextPage: Page[] = [];

/**
 * Navigates back a page.
 */
export function goBack(): void {
    if (lastPage.length < 1) return;

    const goTo = lastPage.pop();
    nextPage.push(currentPage);

    currentPage = goTo;
    navigationEmitter.emit("navigate", { page: goTo });
}

/**
 * Navigates forward a page.
 */
export function goForward(): void {
    if (nextPage.length < 1) return;

    const goTo = nextPage.pop();
    lastPage.push(currentPage);

    currentPage = goTo;
    navigationEmitter.emit("navigate", { page: goTo });
}

/**
 * Lets the app know the page should update.
 * @param page The page to navigate to.
 * @param args The arguments to pass to the page.
 */
export function navigate(page: Page, args?: any) {
    currentPage != page && lastPage.push(currentPage);

    currentPage = page;
    navigationEmitter.emit("navigate", { page, args });
}

/**
 * Registers the specified listener for navigation events.
 * @param listener The listener to register.
 */
export function registerListener(
    listener: (navigate: { page: Page; args?: any }) => void
) {
    navigationEmitter.on("navigate", listener);
}

/**
 * Removes the specified listener from navigation events.
 */
export function removeListeners() {
    navigationEmitter.removeAllListeners();
}
