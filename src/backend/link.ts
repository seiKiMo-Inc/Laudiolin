import { listen, Event } from "@tauri-apps/api/event";

import * as settings from "@backend/settings";
import { login } from "@backend/user";

/*
 * Deep links:
 * - laudiolin://play?id=
 * - laudiolin://listen?id=
 * - laudiolin://login?token=
 * - laudiolin://playlist?id=
 */

/**
 * Sets up event listeners.
 */
export async function setup() {
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
            break;
        case "listen":
            if (action != "id") break;
            break;
        case "login":
            if (action != "token") break;
            if (await login(value)) { // Attempt to log in.
                settings.setToken(value); // Save the token.
                settings.save("authenticated", "discord");
            }
            break;
        case "playlist":
            if (action != "id") break;
            break;
    }
}
