import type { TrackData } from "@backend/types";

import { Gateway } from "@app/constants";

export let connected: boolean = false;
export let gateway: WebSocket | null = null;
const messageQueue: BaseGatewayMessage[] = [];

/**
 * Sets up the gateway.
 */
export function connect(): void {
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

}

/**
 * Invoked when the gateway closes.
 */
function onClose(): void {

}

/**
 * Invoked when the gateway receives a message.
 * @param event The message event.
 */
async function onMessage(event: MessageEvent): Promise<void> {

}

/**
 * Invoked when the gateway encounters an error.
 */
function onError(): void {

}

type BaseGatewayMessage = {
    type: string;
    timestamp: number;
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