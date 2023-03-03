export let Gateway = {
    url: "https://app.seikimo.moe",
    socket: "wss://app.seikimo.moe",

    getUrl: () => Gateway.url
};

/* Web-browser environment. */
export const isWeb = true;

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
