import React from "react";
import ReactDOM from "react-dom/client";

// Setup event listeners.
import { setupListeners } from "@backend/audio";
await setupListeners();

import App from "./ui/App";

const root = document.getElementById("root");
ReactDOM.createRoot(root!).render(<App />);