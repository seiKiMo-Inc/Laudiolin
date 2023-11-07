import type { OfflineUser, OnlineUser, User } from "@app/types";

import { getUserById, token } from "@backend/social/user";
import { gateway, connect, listenAlongWith } from "@backend/social/gateway";

import { targetRoute } from "@backend/social/user";

import TrackPlayer, { usePlayer } from "@mod/player";

import emitter from "@backend/events";
import { useSettings, useUser } from "@backend/stores";

export let listeningWith: User | null = null; // The ID of the user you are currently listening with.

/**
 * Sets up listeners for the social features.
 */
export function setup(): void {
    // Wait for the player to update.
    usePlayer.subscribe(async (state, prevState) => {
        // Check if the tracks are different.
        if (state.paused != prevState.paused) {
            // Update the presence.
            await updatePresence();
        }
    });

    // Wait for tracks to player.
    TrackPlayer.on("begin", async () => {
        // Update the presence.
        await updatePresence();
    });
}

/**
 * Checks if the user is listening with someone.
 */
export function isListeningWith(): boolean {
    return listeningWith != null;
}

/**
 * Listens along with the specified user.
 * @param user The user to listen along with.
 */
export async function listenWith(user: string | null = null): Promise<void> {
    // Check if the user is connected to the gateway.
    if (gateway.readyState == WebSocket.CLOSED)
        connect(); // Attempt to connect to the gateway.

    // Reset the track player.
    TrackPlayer.reset();
    // Set the listening with user.
    listeningWith = user ? await getUserById(user) : null;
    // Inform the gateway to sync with the specified user.
    listenAlongWith(user);
    // Emit the listening event.
    emitter.emit("listen", listeningWith);
}

/**
 * Gets all online users which are listening on Laudiolin.
 * @param active Should only active users be returned?
 */
export async function getAvailableUsers(
    active: boolean = true
): Promise<OnlineUser[]> {
    try {
        const route = `${targetRoute}/social/available?active=${active}`;
        const response = await fetch(route, {
            headers: {
                Authorization: useUser.getState() ? token() : ""
            }
        });

        // Check the response.
        if (response.status != 200) {
            console.error(
                `Failed to get available users: ${response.status} ${response.statusText}`
            );
            return [];
        }

        // Return the users.
        return (await response.json()).onlineUsers;
    } catch {
        return [];
    }
}

/**
 * Gets all offline users which are listening on Laudiolin.
 */
export async function getRecentUsers(): Promise<OfflineUser[]> {
    try {
        const route = `${targetRoute}/social/recent`;
        const response = await fetch(route, {
            headers: {
                Authorization: useUser() ? token() : ""
            }
        });

        // Check the response.
        if (response.status != 200) {
            console.error(
                `Failed to get recent users: ${response.status} ${response.statusText}`
            );
            return [];
        }

        // Return the users.
        return (await response.json()).recentUsers;
    } catch {
        return [];
    }
}

/**
 * Attempts to set the user's Discord rich presence.
 * Only applies if the user is logged in and has Discord connected and presence enabled.
 */
export async function updatePresence(): Promise<void> {
    const user = useUser.getState();
    if (user == null || !user.connections?.discord) return;

    const { system } = useSettings.getState();
    if (system.presence == "None") return;

    const player = usePlayer.getState();

    // Request the gateway to update the presence.
    const track = player.track;
    await fetch(`${targetRoute}/social/presence`, {
        method: "POST", headers: { Authorization: token() },
        body: JSON.stringify({
            track,
            remove: track === null || player.paused,
            broadcast: system.presence,
            started: player.started,
            shouldEnd: Math.round(player.started + (player.duration * 1e3))
        })
    });
}
