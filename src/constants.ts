/* Is the app in development? */
export const isDevelopment = import.meta.env.DEV;

export const Gateway = {
    url: isDevelopment ?
        `http://${import.meta.env.VITE_DEV_GATEWAY_URL}` :
        `https://${import.meta.env.VITE_GATEWAY_URL}`,
    socket: isDevelopment ?
        `ws://${import.meta.env.VITE_DEV_GATEWAY_URL}` :
        `wss://${import.meta.env.VITE_GATEWAY_URL}`,

    getUrl: () => Gateway.url
};

/* Content routes. */
export const contentRoutes = {
    HOME: "/",
    FAVORITES: "/favorites",
// #v-ifdef VITE_BUILD_ENV='desktop'
    DOWNLOADS: "/downloads",
// #v-endif
    PLAYLIST: "/playlist/:id",
    QUEUE: "/queue",
    ELIXIR: "/elixir",
    SETTINGS: "/settings",
    RECENTS: "/recents",
    SEARCH: "/search",
    LOGIN: "/login",
}
