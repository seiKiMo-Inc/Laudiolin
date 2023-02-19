import React from "react";
import { createRoot } from "react-dom/client";

import * as fs from "@mod/fs";

import * as link from "@backend/link";
import * as audio from "@backend/audio";
import * as gateway from "@backend/gateway";

import App from "./ui/App";

(async () => {
    // Run initial setup.
    fs.setup()
        .then(() => fs.createFolders())
        .catch(err => console.error(err));
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
    // Check if the application is in development mode.
    if (process.env.NODE_ENV === "development") {
        const reactDevTools = document.createElement("script");
        reactDevTools.src = "http://localhost:8097";
        document.head.appendChild(reactDevTools);
    }

    // Render the application.
    const root = document.getElementById("root");
    createRoot(root!).render(<App />);
}
