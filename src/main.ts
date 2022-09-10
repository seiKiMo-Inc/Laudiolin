import "bootstrap/dist/css/bootstrap.min.css";
import { setupListeners } from "backend/audio";

// Setup event listeners.
await setupListeners();

import "css/main.css";
import App from "./App.svelte";

const app = new App({
    target: document.getElementById("app")
});

export default app;