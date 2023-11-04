import type { Guild, Synchronize } from "@app/types";
import { targetRoute, token } from "@backend/social/user";

import TrackPlayer, { Loop, Track } from "@mod/player";
import { BaseGatewayMessage, sendGatewayMessage } from "@backend/social/gateway";

export let selectedGuild: string | null = null;
export let selectedBot: string | null = null;

type SetElixirMessage = BaseGatewayMessage & {
    type: "setElixir";
    guild: string;
    bot: string;
};

/**
 * Fetches the user's guilds.
 *
 * @return null if the user did not give permission to access guilds.
 */
export async function getGuilds(): Promise<Guild[] | null> {
    try {
        const response = await fetch(`${targetRoute}/elixir/guilds`, {
            headers: { Authorization: token() }
        });

        if (response.status != 200) {
            return null;
        } else {
            // Extract the guilds from the response.
            const data = await response.json();
            return data["guilds"] as Guild[];
        }
    } catch {
        return null;
    }
}

/**
 * Sets the current guild.
 *
 * @param guild The guild to set.
 * @param bot The bot to set.
 */
export function setGuild(guild: string, bot: string = ""): void {
    selectedGuild = guild;
    selectedBot = bot;

    sendGatewayMessage({
        type: "setElixir",
        timestamp: Date.now(),
        guild, bot
    } as SetElixirMessage);

    // Set the player properties.
    TrackPlayer.posFromState = guild != null;
    TrackPlayer.syncWithBackend = guild != null;
    TrackPlayer.useTickCheck = guild == null;
    TrackPlayer.forceUpdatePlayer = guild == null;

    // Request a full sync.
    if (guild) {
        sendGatewayMessage({
            type: "synchronize",
            timestamp: Date.now(),
            doAll: true
        } as Synchronize);
    } else {
        TrackPlayer.reset();
    }
}

/**
 * Invoked when a 'sync' message is received.
 *
 * @param data The data to synchronize.
 */
export async function syncState(data: Synchronize): Promise<void> {
    if (!("state" in TrackPlayer)) return;
    const state = TrackPlayer.state;

    if (data.doAll !== undefined &&
        data.doAll !== null &&
        !data.doAll) {
        setGuild(null); // Reset the connected state.
        return;
    }
    if (data.playingTrack !== undefined) {
        state.track = data.playingTrack;
        TrackPlayer.current = new Track(data.playingTrack);
    }
    if (data.paused !== undefined) {
        state.paused = data.paused;
    }
    if (data.volume !== undefined) {
        state.volume = data.volume / 100;
        TrackPlayer.emit("volume", state.volume);
    }
    if (data.queue !== undefined) {
        TrackPlayer.queue = data.queue;
        TrackPlayer.emit("queue", data.queue);
    }
    if (data.loopMode !== undefined) {
        let loopMode: Loop;
        switch (data.loopMode) {
            default: throw new Error("Invalid loop mode.");
            case 0: loopMode = "none"; break;
            case 1: loopMode = "queue"; break;
            case 2: loopMode = "track"; break;
        }

        state.loop = loopMode;
    }
    if (data.position !== undefined) {
        state.progress = data.position;
    }
    if (data.shuffle !== undefined) {
        TrackPlayer.queue = TrackPlayer.queue.sort(
            () => Math.random() - 0.5);
        TrackPlayer.emit("shuffle");
    }
}
