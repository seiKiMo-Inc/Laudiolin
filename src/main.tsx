import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import * as fs from "@backend/desktop/fs";

import * as link from "@backend/desktop/link";
import * as audio from "@backend/audio";
import * as gateway from "@backend/gateway";
import * as offline from "@backend/desktop/offline";
import * as settings from "@backend/settings";

import App from "./ui/App";

// Create the router.
export const router = createBrowserRouter([
    { path: "*", element: <App /> }
]);

(async () => {
    // Load settings.
    settings.reloadSettings();

    // Run initial setup.
    fs.setup()
        .then(() => {
            fs.createFolders();
            offline.loadDownloads();
        })
        .catch((err) => console.error(err));
    link.setup().catch((err) => console.error(err));
    audio.setup().catch((err) => console.error(err));
    gateway
        .setup()
        .then(() => gateway.connect())
        .catch((err) => console.error(err));

    render(); // Render the application.
})();

/**
 * Renders the application.
 */
function render() {
    // Render the application.
    const root = document.getElementById("root");
    createRoot(root!).render(<RouterProvider router={router} />);
}
