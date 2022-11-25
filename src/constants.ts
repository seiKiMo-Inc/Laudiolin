// Resolve window information.
const windowData = window.location;
let routeData = {protocol: windowData.protocol, address: windowData.host, port: windowData.port};

/**
 * Loads the route data.
 */
export async function loadRoute(): Promise<void> {
    const response = await fetch(`${windowData.protocol}//${windowData.host}/route.json`);
    routeData = await response.json();

    // Update existing route data.
    AccessDetails.route = {
        port: routeData.port,
        address: routeData.address,
        formed: `${routeData.protocol}//${routeData.address}${routeData.port ? `:${routeData.port}` : ""}`
    };
}

export const Pages = {
    home: "/",
    searchResults: "/search-results",
    settings: "/settings",
    playlist: "/playlist/:id",
    track: "/track/:id",
    login: "/login",
    user: "/user",
    error: "/error"
};

export const PageTransitions = {
    initial: { opacity: 0, translateX: -100 },
    animate: { opacity: 1, translateX: 0 },
    exit: { opacity: 0, translateX: 100 },
    transition: { duration: 0.1 }
};


export const AccessDetails = {
    url: window.location.origin,
    protocol: window.location.protocol,
    encrypted: window.location.protocol === "https:",
    address: window.location.hostname,
    port: window.location.port ? parseInt(window.location.port) : 80,
    formed: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ""}`,

    route: {
        port: routeData.port,
        address: routeData.address,
        formed: `${routeData.protocol}//${routeData.address}${routeData.port ? `:${routeData.port}` : ""}`
    }
};