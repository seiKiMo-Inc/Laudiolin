import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import * as audio from "@backend/audio";
import * as gateway from "@backend/gateway";
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
