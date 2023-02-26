import React from "react";

import Home from "@pages/Home";
import Search from "@pages/Search";
import Settings from "@pages/Settings";
import Playlist from "@pages/Playlist";
import Recents from "@pages/Recents";
import Favorites from "@pages/Favorites";
import Queue from "@pages/Queue";

import Login from "@widget/Login";

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
        registerListener(({ page, args }) => this.navigate(page, args)); // Register navigation listeners.
    }

    componentWillUnmount() {
        removeListeners(); // Remove navigation listeners.
    }

    render() {
        return (
            <>
                {this.state.page == "Home" && <Home />}
                {this.state.page == "Login" && <Login />}
                {this.state.page == "Search" && (
                    <Search pageArgs={this.state.args} />
                )}
                {this.state.page == "Recents" && <Recents />}
                {this.state.page == "Favorites" && <Favorites />}
                {this.state.page == "Playlist" && (
                    <Playlist pageArgs={this.state.args} />
                )}
                {this.state.page == "Settings" && <Settings />}
                {this.state.page == "Queue" && <Queue />}
            </>
        );
    }
}

export default Navigate;
