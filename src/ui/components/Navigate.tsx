import React from "react";

import Home from "@pages/Home";
import SearchResults from "@pages/SearchResults";

import type { Page } from "@backend/types";
import { registerListener, removeListeners } from "@backend/navigation";

interface IState {
    page: Page;
    args: any;
}

class Navigate extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            page: "Home",
            args: null
        };
    }

    /**
     * Navigate to a page.
     * @param page The page to navigate to.
     * @param args Any arguments to pass to the page.
     */
    navigate(page: Page, args?: any): void {
        this.setState({ page, args });
    }

    componentDidMount() {
        registerListener(({ page, args }) =>
            this.navigate(page, args)); // Register navigation listeners.
    }

    componentWillUnmount() {
        removeListeners(); // Remove navigation listeners.
    }

    render() {
        return (
            <>
                { this.state.page == "Home" && <Home /> }
                { this.state.page == "Search" && <SearchResults pageArgs={this.state.args} /> }
                { this.state.page == "Recents" && <p>Recents</p> }
                { this.state.page == "Profile" && <p>Profile</p> }
                { this.state.page == "Favorites" && <p>Favorites</p> }
                { this.state.page == "Downloads" && <p>Downloads</p> }
                { this.state.page == "Playlist" && <p>Playlist</p> }
                { this.state.page == "Settings" && <p>Settings</p> }
            </>
        );
    }
}

export default Navigate;
