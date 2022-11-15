import React from "react";
import AnimatePages from "@components/AnimatePages";
import PlaylistsGrid from "@components/playlist/PlaylistsGrid";

class HomePage extends React.Component<any, any> {
    render() {
        return (
            <AnimatePages>
                <div>
                    <h2 style={{ fontSize: 25, color: "white", marginLeft: 30, fontFamily: "cursive" }}>Your Playlists:</h2>
                    <PlaylistsGrid />
                </div>
            </AnimatePages>
        );
    }
}

export default HomePage;
