export const Pages = {
    home: "/",
    searchResults: "/search-results",
    settings: "/settings",
    playlist: "/playlist/:id",
    track: "/track/:id",
};

export const PageTransitions = {
    initial: { opacity: 0, translateX: -100 },
    animate: { opacity: 1, translateX: 0 },
    exit: { opacity: 0, translateX: 100 },
    transition: { duration: 0.1 }
};
