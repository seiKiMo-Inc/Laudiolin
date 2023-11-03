import type { Synchronize, TrackData } from "@app/types";

import { loadRecents, token } from "@backend/user";
import { audio, system } from "@backend/settings";
import { syncToTrack } from "@backend/audio";
import { listenWith } from "@backend/social";
import { syncState } from "@backend/elixir";

import { Gateway } from "@app/constants";
import emitter from "@backend/events";
import TrackPlayer from "@mod/player";

export let connected: boolean = false;
export let gateway: WebSocket | null = null;
const messageQueue: BaseGatewayMessage[] = [];

interface SyncData {
    seek?: number; // Included track progress.
    update?: boolean; // Discord rich presence update.
}

/**
 * Sets up the gateway.
 * (for listeners)
 */
export async function setup(): Promise<void> {
    const playerSync = (data?: SyncData) => {
        update() // Update the player progress.
            .catch((err) => console.warn(err));
        playerUpdate(data) // Update the player status.
            .catch((err) => console.warn(err));
    };

    // Add playback event listeners.
    TrackPlayer.on("play", () => playerSync({ update: true }));
    TrackPlayer.on("pause", () => playerSync({ update: true }));
    TrackPlayer.on("stop", () => playerSync());
    TrackPlayer.on("seek", playerSync);
    TrackPlayer.on("end", () => playerSync());

    // Add the update listener.
    TrackPlayer.on("update", update);
}

/**
 * Updates the current track info.
 */
async function update(): Promise<void> {
    // Check if the track is playing.
    const currentTrack = TrackPlayer.getCurrentTrack();
    // Check if the track is a local track.
    const url = currentTrack?.url as string;
    if (url && url.startsWith("file://")) return;

    // Send player information to the gateway.
    connected && currentTrack && !TrackPlayer.paused &&
        sendGatewayMessage(<SeekMessage>{
            type: "seek",
            timestamp: Date.now(),
            seek: TrackPlayer.getProgress()
        });
}

/**
 * Updates the player details on the backend.
 */
export async function playerUpdate(data?: SyncData): Promise<void> {
    // Pull data properties.
    const { seek, update } =
    data ?? { seek: null, update: null };

    // Check if the track is playing.
    const currentTrack = TrackPlayer.getCurrentTrack();
    // Check if the track is a local track.
    const url = currentTrack?.url as string;
    if (url && url.startsWith("file://")) return;

    // Send player information to the gateway.
    connected &&
        sendGatewayMessage(<PlayerMessage>{
            type: "player",
            seek: seek ?? TrackPlayer.getProgress(),
            track: currentTrack ? currentTrack.data : null,
            paused: TrackPlayer.paused,
            update: update ?? false
        });
}

/**
 * Sets up the gateway.
 */
export function connect(): void {
    if (connected) return;

    console.info("Connecting to gateway...");

    // Create a WebSocket.
    gateway = new WebSocket(Gateway.socket);
    // Add the event listeners.
    gateway.onopen = onOpen;
    gateway.onclose = onClose;
    gateway.onmessage = onMessage;
    gateway.onerror = onError;
}

/**
 * Invoked when the gateway is opened.
 */
function onOpen(): void {
    console.info("Connected to the gateway.");

    // Wait for the gateway to be ready.
    let wait = setInterval(() => {
        // Check the state of the gateway.
        if (gateway?.readyState != WebSocket.OPEN) return;
        clearInterval(wait);

        // Send the initialization message.
        sendInitMessage();
        // Log gateway handshake.
        console.info("Gateway handshake complete.");

        // Set connected to true.
        connected = true;
        // Send all queued messages.
        messageQueue.forEach((message) => sendGatewayMessage(message));

        // Check if the player is playing.
        if (TrackPlayer.getCurrentTrack() != null) {
            // Send player status update.
            playerUpdate()
                .catch(err => console.warn(err));
        }
    }, 500);
}

/**
 * Invoked when the gateway closes.
 */
function onClose(close: any): void {
    console.info("Disconnected from the gateway.", close);

    // Reset the connection state.
    connected = false;

    // Attempt to reconnect to the gateway.
    setTimeout(() => connect(), 5e3);
}

/**
 * Invoked when the gateway receives a message.
 * @param event The message event.
 */
async function onMessage(event: MessageEvent): Promise<void> {
    // Parse the message data.
    let message: BaseGatewayMessage | null = null;
    try {
        message = JSON.parse(event.data);
    } catch {
        console.error("Failed to parse message data.");
        return;
    }

    // Handle the message data.
    switch (message?.type) {
        case "initialize":
            return;
        case "latency":
            // Send another latency ping after 10s.
            setTimeout(
                () => sendGatewayMessage(<LatencyMessage>{ type: "latency" }),
                10e3
            );
            return;
        case "sync":
            const { track, progress, paused, seek } = message as SyncMessage;

            // Validate the track.
            if (track == null && progress == -1) {
                await listenWith(null); // Stop listening along.
            }

            // Pass the message to the player.
            await syncToTrack(track, progress, paused, seek);
            return;
        case "recents":
            const { recents } = message as RecentsMessage;

            await loadRecents(recents); // Load the recents.
            emitter.emit("recent"); // Emit the recents event.
            return;
        case "synchronize":
            await syncState(message as Synchronize);
            return;
        default:
            console.warn(message.message ?? "No message provided.", message);
            return;
    }
}

/**
 * Invoked when the gateway encounters an error.
 */
function onError(error: any): void {
    console.error("Gateway error.", error, Gateway.socket);
}

/**
 * Sends the initialization message to the gateway.
 */
function sendInitMessage(): void {
    try {
        gateway?.send(
            JSON.stringify(<InitializeMessage>{
                type: "initialize",
                timestamp: Date.now(),
                token: token(),
                broadcast: system().broadcast_listening,
                presence: system().presence
            })
        );
    } catch (err) {
        console.error("Failed to send initialize message.", err);
    }
}

/**
 * Sends a message to the gateway.
 * @param message The raw message data.
 */
export function sendGatewayMessage(message: BaseGatewayMessage) {
    if (!connected) {
        // Queue the message.
        messageQueue.push(message);
        return;
    }

    // Check if the message contains the proper fields.
    if (!message.type) throw new Error("Message type is required.");
    if (!message.timestamp) message.timestamp = Date.now();

    // Send the message to the gateway.
    if (gateway && gateway.readyState == WebSocket.OPEN)
        gateway.send(JSON.stringify(message));
}

/**
 * Returns the URL for audio download.
 * @param track The track to get the URL for.
 */
export function getDownloadUrl(track: TrackData): string {
    return `${Gateway.getUrl()}/download?id=${track.id}`;
}

/**
 * Returns the URL for audio streaming.
 * @param track The track to get the URL for.
 */
export function getStreamingUrl(track: TrackData): string {
    return `${Gateway.getUrl()}/stream?id=${track.id}&quality=${
        audio().audio_quality
    }`;
}

/**
 * Tells the gateway to sync the audio between this client and the specified user.
 * @param userId The user ID to sync with.
 */
export function listenAlongWith(userId: string | null): void {
    sendGatewayMessage(<ListenMessage>{
        type: "listen",
        with: userId
    });
}

export type BaseGatewayMessage = {
    type: string;
    timestamp: number;
    message?: string;
};

// To server.
export type InitializeMessage = BaseGatewayMessage & {
    type: "initialize";
    token?: string;
    broadcast?: string;
    presence?: string;
};
// To server.
export type LatencyMessage = BaseGatewayMessage & {
    type: "latency";
};
// To server.
export type SeekMessage = BaseGatewayMessage & {
    type: "seek";
    seek: number;
};
/**
 * From server.
 * @param with The user ID of the person to listen along with. Can be null to stop.
 */
export type ListenMessage = BaseGatewayMessage & {
    type: "listen";
    with: string;
};
// From server.
export type PlayerMessage = BaseGatewayMessage & {
    type: "player";
    track: TrackData | null;
    seek: number; // Track progress.
    paused: boolean; // Is the player paused.
    update: boolean; // Should the presence be updated?
};

// To client.
export type SyncMessage = BaseGatewayMessage & {
    type: "sync";
    track: TrackData | null;
    progress: number;
    paused: boolean;
    seek: boolean;
};
// To client.
export type RecentsMessage = BaseGatewayMessage & {
    type: "recents";
    recents: TrackData[];
};
