import React from "react";
import ReactDOM from "react-dom/client";

// Setup event listeners.
import { setupListeners } from "@backend/audio";
setupListeners().then(continueSetup);

import App from "./ui/App";

function continueSetup() {
    const root = document.getElementById("root");
    ReactDOM.createRoot(root!).render(<App />);
}