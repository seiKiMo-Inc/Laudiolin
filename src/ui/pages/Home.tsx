import React from "react";
import { Navigate } from "react-router-dom";

import AnimatePages from "@components/common/AnimatePages";
import PlaylistsGrid from "@components/playlist/PlaylistsGrid";
import { Pages } from "@app/constants";

class HomePage extends React.Component<any, any> {
    isLoggedIn: boolean = !(
        (localStorage.getItem("isAuthenticated") === "false" || !localStorage.getItem("isAuthenticated")) &&
        (localStorage.getItem("isGuest") === "false" || !localStorage.getItem("isGuest"))
    );

    render() {
        if (!this.isLoggedIn)
            return <Navigate to={Pages.login} />;

        return (
            <AnimatePages>
                <div>
                    <h2 style={{ fontSize: 25, color: "white", marginLeft: 30, fontFamily: "cursive" }}>
                        Your Playlists:
                    </h2>
                    <PlaylistsGrid />
                </div>
            </AnimatePages>
        );
    }
}

export default HomePage;
