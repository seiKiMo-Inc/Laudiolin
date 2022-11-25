import React from "react";
import ReactDOM from "react-dom/client";

import * as constants from "@app/constants";

// Setup event listeners.
import * as user from "@backend/user";
import * as audio from "@backend/audio";
import * as gateway from "@backend/gateway";
import * as settings from "@backend/settings";

(async () => {
    // Load route data.
    await constants.loadRoute();
    // Fetch the application settings.
    await settings.reloadSettings();

    // Setup listeners.
    await audio.setupListeners();
    await gateway.setupListeners();

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
        await user.login().catch(error => {
            sessionStorage.setItem("loginError", "true");
            console.log(error);
        }); // Login the user.
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
