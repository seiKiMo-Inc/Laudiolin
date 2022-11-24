import React from "react";
import { Navigate } from "react-router-dom";

import { Playlist } from "@backend/types";
import { fetchAllPlaylists } from "@backend/playlist";
import { login } from "@backend/user";
import emitter from "@backend/events";

import AnimatePages from "@components/common/AnimatePages";
import PlaylistsGrid from "@components/playlist/PlaylistsGrid";
import { Pages } from "@app/constants";

interface IState {
    isLoggedIn: boolean;
    playlists: Playlist[];
}

class HomePage extends React.Component<any, IState> {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn:  !(
                (localStorage.getItem("isAuthenticated") === "false" || !localStorage.getItem("isAuthenticated")) &&
                (localStorage.getItem("isGuest") === "false" || !localStorage.getItem("isGuest"))
            ),
            playlists: fetchAllPlaylists()
        };
    }

    componentDidMount() {
        emitter.on("playlist-grid-update", async () => {
            await login();
            this.setState({ playlists: fetchAllPlaylists() });
        });
    }

    render() {
        if (!this.state.isLoggedIn)
            return <Navigate to={Pages.login} />;

        return (
            <AnimatePages>
                <div>
                    <h2 style={{ fontSize: 25, color: "white", marginLeft: 30 }}>
                        Your Playlists:
                    </h2>
                    <PlaylistsGrid playlists={this.state.playlists} />
                </div>
            </AnimatePages>
        );
    }
}

export default HomePage;
