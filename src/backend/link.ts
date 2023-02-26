import { listenWith } from "@backend/social";
import { fetchTrackById } from "@backend/search";
import { playTrack } from "@backend/audio";
import { navigate } from "@backend/navigation";
import { getPlaylistById } from "@backend/playlist";

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
            playlist && navigate("Playlist", playlist);
            break;
        case "listen":
            listenWith(value).catch((err) => console.warn(err));
            break;
    }
}
