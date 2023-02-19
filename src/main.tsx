import React from "react";
import { createRoot } from "react-dom/client";

import * as link from "@backend/link";
import * as audio from "@backend/audio";
import * as gateway from "@backend/gateway";

import App from "./ui/App";

(async () => {
    // Run initial setup.
    link.setup()
        .catch(err => console.error(err));
    audio.setup()
        .catch(err => console.error(err));
    gateway.setup()
        .then(() => gateway.connect())
        .catch(err => console.error(err));

    render(); // Render the application.
})();

/**
 * Renders the application.
 */
function render() {
    // Render the application.
    const root = document.getElementById("root");
    createRoot(root!).render(<App />);
}
