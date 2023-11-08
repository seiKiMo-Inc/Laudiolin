import { Theme } from "@app/types";

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
};

/* Default dark theme. */
export const darkTheme = (): Theme => ({
    background: {
        primary: "#1A1A1A",
        secondary: "#262626"
    },
    icon: {
        primary: "#ffffff",
        secondary: "#999999"
    },
    text: {
        primary: "#ffffff",
        secondary: "#a6a6a6",
        tertiary: "#999999"
    },
    accent: "#3484fc"
});

/* Default light theme. */
export const lightTheme = (): Theme => ({
    background: {
        primary: "#EEEEEE",
        secondary: "#FAFAFA"
    },
    icon: {
        primary: "#656565",
        secondary: "#838383"
    },
    text: {
        primary: "#656565",
        secondary: "#A6A6A6",
        tertiary: "#838383"
    },
    accent: "#ED7D64"
});
