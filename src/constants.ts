export let Gateway = {
    url: "http://localhost:3000",
    socket: "ws://localhost:3000",

    getUrl: () => Gateway.url
};

export const ContentRoutes = {
    home: "/",
    search: "/search",
    recents: "/recents",
    user: "/user",
    favorites: "/user/favorite",
    downloads: "/downloads",
    settings: "/settings",
}
