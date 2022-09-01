import {app, BrowserWindow} from "electron";

const createWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    window.loadURL(process.env["NODE_ENV"] == "development" ?
        "http://localhost:9000" :
        `file://${__dirname}/index.html`);
};

app.on("ready", createWindow);