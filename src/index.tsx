import React from "react";
import ReactDOM from "react-dom/client";

const App = () => {
    return (
        <div>
            Hello World!
        </div>
    );
};

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);