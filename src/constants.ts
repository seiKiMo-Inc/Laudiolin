/* Web-browser environment. */
export const isWeb = true;
/* Is the app in development? */
export const isDevelopment = false;

export const Gateway = {
    url: isDevelopment ? "http://localhost:3001" : "https://app.seikimo.moe",
    socket: isDevelopment ? "ws://localhost:3001" : "wss://app.seikimo.moe",

    getUrl: () => Gateway.url
};

/* Content routes. */
export const contentRoutes = {
    HOME: "/",
    FAVORITES: "/favorites",
    PLAYLIST: "/playlist/:id",
    QUEUE: "/queue",
    SETTINGS: "/settings",
    RECENTS: "/recents",
    SEARCH: "/search",
    LOGIN: "/login",
}
