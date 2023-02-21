import React from "react";
import { createRoot } from "react-dom/client";

import * as fs from "@mod/fs";

import * as link from "@backend/link";
import * as audio from "@backend/audio";
import * as gateway from "@backend/gateway";
import * as offline from "@backend/offline";
import * as settings from "@backend/settings";

import App from "./ui/App";

(async () => {
    // Load settings.
    settings.reloadSettings();

    // Run initial setup.
    fs.setup()
        .then(() => {
            fs.createFolders();
            offline.loadDownloads();
        })
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
    // Render the application.
    const root = document.getElementById("root");
    createRoot(root!).render(<App />);
}
