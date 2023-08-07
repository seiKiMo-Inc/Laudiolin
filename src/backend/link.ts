import { listenWith } from "@backend/social";
import { fetchTrackById } from "@backend/search";
import { playTrack } from "@backend/audio";
import { getPlaylistById } from "@backend/playlist";
import { router } from "@app/main";
import { contentRoutes } from "@app/constants";

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
                playTrack(track, false, true)
                    .catch((err) => console.warn(err));

            // Try to open the URL in the desktop app.
            window.location.replace(`laudiolin://play?id=${value}`);
            break;
        case "playlist":
            const playlist = await getPlaylistById(value);
            playlist && await router.navigate(`${contentRoutes.PLAYLIST.substring(0, contentRoutes.PLAYLIST.length - 3)}${playlist.id}`);

            // Try to open the URL in the desktop app.
            window.location.replace(`laudiolin://playlist?id=${value}`);
            return;
        case "listen":
            listenWith(value).catch((err) => console.warn(err));

            // Try to open the URL in the desktop app.
            window.location.replace(`laudiolin://listen?id=${value}`);
            break;
    }

    // Navigate to the home page.
    await router.navigate(contentRoutes.HOME);
}
