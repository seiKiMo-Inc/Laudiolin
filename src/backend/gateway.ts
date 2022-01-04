import { emit, listen } from "@tauri-apps/api/event";

import { player, Track } from "@backend/audio";

import type { Event } from "@tauri-apps/api/helpers/event";

let gateway: WebSocket|null = null;

type GatewayConfig = {
    encrypted: boolean;
    address: string;
    port: number;
};

type BaseGatewayMessage = {
    type: string;
    timestamp: number;
};

// To server.
type InitializeMessage = BaseGatewayMessage & {
    type: "initialize";
};
// To server.
type LatencyMessage = BaseGatewayMessage & {
    type: "latency";
};
// To server.
type NowPlayingMessage = BaseGatewayMessage & {
    type: "playing";
    track: Track|null;
    seek: number;
};

// To & from server.
type VolumeMessage = BaseGatewayMessage & {
    type: "volume";
    volume: number;
    send_back: boolean;
};

type GatewayMessagePayload = {
    data: string;
};

/**
 * Sets up event listeners.
 */
export async function setupListeners() {
    console.log("Setting up gateway event listeners...");
    await listen("send_message", sendMessage);

    // Setup audio listeners for gateway.
    player.on("volume", volume => {
        // Send the volume to the gateway.
        sendGatewayMessage(JSON.stringify(<VolumeMessage> {
            type: "volume", volume, send_back: false
        }));
    });

    player.on("start", update);
    player.on("stop", update);
    // player.on("pause", update);
    // player.on("resume", update);
    player.on("end", update);
    player.on("seek", update);
}

/**
 * Sets up the gateway.
 * @param config The gateway configuration.
 */
export function setupGateway(config: GatewayConfig) {
    // Create a new WebSocket.
    gateway = new WebSocket(`${config.encrypted ? "wss" : "ws"}://${config.address}:${config.port}`);
    // Add the event listeners.
    gateway.onopen = onOpen;
    gateway.onmessage = onMessage;
    gateway.onclose = onClose;
    gateway.onerror = onError;
}

/**
 * Sends a message to the gateway.
 * @param message The raw message data.
 */
export function sendGatewayMessage(message: string|object) {
    // Serialize message if it is an object.
    if(typeof message === "object") {
        message = JSON.stringify(message);
    }

    // Send the message to the gateway.
    gateway?.send(message);
    console.log("Sent message to gateway:", message);
}

/**
 * Updates the current track info.
 * @param data The track data.
 */
function update(data: any) {
    console.log("Sent player information to gateway.");

    // Send player information to the gateway.
    sendGatewayMessage(<NowPlayingMessage> {
        type: "playing",
        track: player.getCurrentTrack(),
        seek: player.getProgress()
    });
}

/**
 * Sends a message to the gateway.
 * @param event The event.
 */
function sendMessage(event: Event<any>) {
    // Parse the payload from the event.
    const payload: GatewayMessagePayload = event.payload;
    // Send the message to the gateway.
    sendGatewayMessage(payload.data);
}

/**
 * Invoked when the gateway is opened.
 */
function onOpen() {
    console.debug("Gateway connection opened.");
}

/**
 * Invoked when a message is received from the gateway.
 * @param event The receive message event.
 */
async function onMessage(event: MessageEvent) {
    // Parse the message.
    const message: BaseGatewayMessage = JSON.parse(event.data);
    // Check if the message should be handled.
    switch(message.type) {
        case "initialize":
            console.debug("Gateway handshake complete.");
            gateway?.send(JSON.stringify(<InitializeMessage> {
                type: "initialize"
            }));
            return;
        case "latency":
            gateway?.send(JSON.stringify(<LatencyMessage> {
                type: "latency"
            }));
            return;
    }

    // Pass the message to the backend.
    await emit("receive_message", event.data);
}

/**
 * Invoked when the gateway is closed.
 */
function onClose() {
    console.debug("Gateway connection closed.");
    // TODO: Display message to user.
}

/**
 * Invoked when an error occurs with the gateway.
 */
function onError() {
    console.debug("Gateway connection error.");
    // TODO: Display message to user.
}