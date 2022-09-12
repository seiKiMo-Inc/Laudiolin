import React from "react";
import ReactDOM from "react-dom/client";

// Setup event listeners.
import * as audio from "@backend/audio";
import * as gateway from "@backend/gateway";

(async() => {
    // Setup listeners.
    await audio.setupListeners();
    await gateway.setupListeners();

    // Run gateway setup after.
    setTimeout(() => {
        gateway.setupGateway({
            encrypted: false,
            address: "localhost",
            port: 3001
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