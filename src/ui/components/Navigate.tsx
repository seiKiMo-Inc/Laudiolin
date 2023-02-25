import React from "react";

import Home from "@pages/Home";
import Search from "@pages/Search";
import Settings from "@pages/Settings";
import Playlist from "@pages/Playlist";

import Login from "@widget/Login";
import TrackList from "@components/TrackList";

import type { Page } from "@backend/types";
import { downloads } from "@backend/offline";
import { recents, favorites } from "@backend/user";
import { registerListener, removeListeners } from "@backend/navigation";

import TrackPlayer from "@mod/player";

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
                {this.state.page == "Recents" && (
                    <TrackList
                        title={"Recents"}
                        events={["login", "recent"]}
                        collection={() => recents}
                    />
                )}
                {this.state.page == "Favorites" && (
                    <TrackList
                        title={"Favorites"}
                        events={["login", "favorites"]}
                        collection={() => favorites}
                    />
                )}
                {this.state.page == "Downloads" && (
                    <TrackList
                        title={"Downloads"}
                        events={["login", "downloads"]}
                        collection={() => downloads}
                    />
                )}
                {this.state.page == "Playlist" && (
                    <Playlist pageArgs={this.state.args} />
                )}
                {this.state.page == "Settings" && <Settings />}
                {this.state.page == "Queue" && (
                    <TrackList
                        title={"Queue"}
                        events={[
                            "play",
                            "stop",
                            "destroy",
                            "end",
                            "shuffle",
                            "queue"
                        ]}
                        collection={() => TrackPlayer.getQueue()}
                        emitter={TrackPlayer}
                        queue={true}
                    />
                )}
            </>
        );
    }
}

export default Navigate;
