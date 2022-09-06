import {app, BrowserWindow} from "electron";
import electronIsDev from "electron-is-dev";

const createWindow = () => {
    const window = new BrowserWindow({
        // Default window dimensions.
        width: 800, height: 600, minWidth: 400, minHeight: 300,

        // Browser preferences.
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    window.loadURL(electronIsDev ?
        "http://localhost:9000" :
        `file://${__dirname}/index.html`);
};

app.on("ready", createWindow);