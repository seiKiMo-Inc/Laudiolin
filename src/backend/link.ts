import { listen, Event } from "@tauri-apps/api/event";
import { listenAlongWith } from "@backend/gateway";

/*
 * Deep links:
 * - laudiolin://play?id=
 * - laudiolin://listen?user=
 * - laudiolin://playlist?id=
 */

/**
 * Sets up event listeners.
 */
export async function setupListeners() {
    console.log("Setting up link event listeners...");
    await listen("deeplink", onLinked);
}

/**
 * Invoked when a deep link call is received.
 * @param event The event.
 */
async function onLinked(event: Event<string>) {
    const { payload } = event;

    // Validate the payload.
    if (!payload.startsWith("laudiolin://"))
        return;

    // Parse the payload.
    const data = payload.split(":")[1];
    const query = data.split("/")[2];

    let param = "", action = "", value = "";
    if (payload.includes("?") && payload.includes("=")) {
        param = payload.split("?")[1];
        action = param.split("=")[0];
        value = param.split("=")[1];
    }

    switch (query) {
        default:
            console.error("Unknown query: " + query);
            break;
        case "play":
            if (action != "id") break;
            window.location.href = `/track/${value}`;
            break;
        case "listen":
            if (action != "id") break;
            listenAlongWith(value);
            break;
        case "playlist":
            if (action != "id") break;
            window.location.href = `/playlist/${value}`;
            break;
    }
}