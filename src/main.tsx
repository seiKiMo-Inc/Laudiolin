import React from "react";
import ReactDOM from "react-dom/client";

// Setup event listeners.
import * as fs from "@backend/fs";
import * as user from "@backend/user";
import * as audio from "@backend/audio";
import * as events from "@backend/events";
import * as discord from "@backend/discord";
import * as gateway from "@backend/gateway";
import * as settings from "@backend/settings";

(async () => {
    // Initialize the file system.
    await fs.initialize();
    // Fetch the application settings.
    await settings.reloadSettings();

    // Setup listeners.
    await audio.setupListeners();
    await events.setupListeners();
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

    // Load user data if the user is logged in.
    user.loadRoute(); // Load the gateway route.
    if (localStorage.getItem("isAuthenticated") == "true") {
        await user.login().catch(() => sessionStorage.setItem("loginError", "true")); // Login the user.
        discord.setupListeners(); // Set up Discord listeners.
    }

    // Continue setup.
    continueSetup();
})();

import App from "./ui/App";

function continueSetup() {
    // Force dark mode.
    document.body.classList.add("dark");
    settings.save("darkMode", "true");

    // Render the application.
    const root = document.getElementById("root");
    ReactDOM.createRoot(root!).render(<App />);
}
