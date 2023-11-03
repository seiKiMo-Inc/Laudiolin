import { listen, Event } from "@tauri-apps/api/event";

import * as settings from "@backend/settings";
import { login } from "@backend/user";
import { listenWith } from "@backend/social";
import { fetchTrackById } from "@backend/search";
import { playTrack } from "@backend/audio";
import { getPlaylistById } from "@backend/playlist";
import { router } from "@app/main";
import { contentRoutes } from "@app/constants";

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
    if (!payload.startsWith("laudiolin://")) return;

    // Parse the payload.
    const data = payload.split(":")[1];
    const query = data.split("/")[2];

    let param = "",
        action = "",
        value = "";
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
            const track = await fetchTrackById(value);
            track &&
                playTrack(track, true, true).catch((err) => console.warn(err));
            break;
        case "listen":
            if (action != "id") break;
            listenWith(value).then((err) => console.warn(err));
            break;
        case "login":
            if (action != "token") break;
            if (await login(value)) {
                // Attempt to log in.
                settings.setToken(value); // Save the token.
                settings.save("authenticated", "discord");
            }
            break;
        case "playlist":
            if (action != "id") break;
            const playlist = await getPlaylistById(value);
            playlist && await router.navigate(`${contentRoutes.PLAYLIST.substring(0, contentRoutes.PLAYLIST.length - 3)}${playlist.id}`);
            break;
    }
}

/**
 * Opens a specified location from a URL.
 */
export async function openFromUrl(): Promise<void> {
    const url = window.location.href.split("/");

    // Validate the route.
    if (url.length < 5) return;
    // Split the route.
    const query = url[3].trim();
    const value = url[4].trim();

    switch (query) {
        default:
            console.warn("Unknown URL parameters.", url);
            break;
        case "track":
            // TODO: Display track preview page.
            const track = await fetchTrackById(value);
            track &&
                playTrack(track, true, true)
                    .catch((err) => console.warn(err));
            break;
        case "playlist":
            const playlist = await getPlaylistById(value);
            playlist && await router.navigate(`${contentRoutes.PLAYLIST.substring(0, contentRoutes.PLAYLIST.length - 3)}${playlist.id}`);
            return;
        case "listen":
            listenWith(value).catch((err) => console.warn(err));
            break;
    }

    // Navigate to the home page.
    await router.navigate(contentRoutes.HOME);
}
