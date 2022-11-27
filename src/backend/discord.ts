import type { RichPresence } from "@backend/types";
import { player, Track } from "@backend/audio";

import { invoke } from "@tauri-apps/api/tauri";

const emptyPresence: RichPresence = {
    details: null,
    state: null,
    start_timestamp: null,
    end_timestamp: null,
    large_image_key: null,
    large_image_text: null,
    small_image_key: null,
    small_image_text: null,
    party_id: null,
    party_size: null,
    party_max: null,
    match_secret: null,
    join_secret: null,
    spectate_secret: null,
    instance: true
};

let updateTask: any = null;
const updatePresence = async () => {
    const currentTrack = player.getCurrentTrack();
    if (!currentTrack) return;

    // Update the rich presence.
    await setPresence(fromTrack(currentTrack), false);
};
const start = () => {
    updatePresence().then(() =>
        updateTask = setInterval(updatePresence, 15e3))
};
const clear = () => {
    if (updateTask) clearInterval(updateTask);
    clearPresence().then(() => updateTask = null);
};

/**
 * Sets up event listeners for the audio player.
 */
export function setupListeners() {
    player.on("start", start);
    player.on("resume", start);
    player.on("stop", clear);
    player.on("pause", clear);
    player.on("seek", updatePresence);
}

/*
 * Utility methods for Rich Presence conversion.
 */

/**
 * Creates a rich presence from a track's data.
 * @param track The track to create a rich presence from.
 */
export function fromTrack(track: Track): RichPresence {
    const data = track.getData();

    // Calculate the ends in.
    const endsIn = (data.duration - track.seek()) * 1000;
    // Check the artist.
    const artist = data.artist.trim().length <= 0 ? "" : data.artist;

    // Create a rich presence.
    const result = {
        ...emptyPresence,

        end_timestamp: Math.round(Date.now() + endsIn),
        details: `Listening to ${data.title}`,
        large_image_key: data.icon,
        large_image_text: data.title,
        small_image_key: "icon",
        small_image_text: "Laudiolin"
    };

    // Add optional fields.
    if (artist.length > 0)
        result.state = `by ${artist}`;
    else if (data.title.length > 30) {
        // Optimally split the title.
        const title = data.title.split(" ");

        let add = true, length = 0, firstPart = "";
        while (add) {
            const word = title.shift();
            if (word.length + length > 30)
                add = false;
            else {
                firstPart += word + " ";
                length += word.length + 1;
            }
        }

        result.details = firstPart;
        result.state = title.join(" ");
    }

    return result;
}

/*
 * Presence abstraction for TypeScript -> Rust.
 */

/**
 * Sets the Discord Rich Presence.
 * @param presence The presence to set.
 * @param fromEmpty Should the presence be set from an empty presence?
 */
export async function setPresence(presence: any|RichPresence, fromEmpty = true): Promise<void> {
    if (fromEmpty) {
        const duplicate = Object.assign({}, emptyPresence);
        presence = Object.assign(duplicate, presence);
    }

    // Pass the presence object to the backend.
    await invoke("update_presence", { presence });
}

/**
 * Clears the Discord Rich Presence.
 */
export async function clearPresence(): Promise<void> {
    await invoke("clear_presence");
}