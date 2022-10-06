import React from "react";
import ReactDOM from "react-dom/client";

// Setup event listeners.
import * as fs from "@backend/fs";
import * as audio from "@backend/audio";
import * as gateway from "@backend/gateway";
import * as settings from "@backend/settings";

import { invoke } from "@tauri-apps/api/tauri";

(async () => {
    // Initialize the file system.
    await fs.initialize();
    // Fetch the application settings.
    await settings.reloadSettings();

    // Setup listeners.
    await audio.setupListeners();
    await gateway.setupListeners();
    await settings.setupListeners();

    // Run gateway setup after.
    setTimeout(() => {
        const config = settings.gateway();
        gateway.setupGateway({
            encrypted: config.encrypted,
            address: config.address,
            port: config.gateway_port
        });
    }, 3000);

    // Continue setup.
    continueSetup();
})();

import App from "./ui/App";

function continueSetup() {
    const root = document.getElementById("root");
    ReactDOM.createRoot(root!).render(<App />);
}
