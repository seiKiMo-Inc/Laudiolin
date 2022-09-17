export const Pages = {
    home: '/',
    searchResults: '/search-results',
    settings: '/settings'
};

export const PageTransitions = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
    transition: { duration: 0.1 }
};