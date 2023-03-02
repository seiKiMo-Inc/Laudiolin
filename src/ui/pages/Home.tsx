import React from "react";

import AnimatedView from "@components/common/AnimatedView";
import Playlists from "@components/home/Playlists";
import Recents from "@components/home/Recents";
import Favorites from "@components/home/Favorites";

import { playlists, recents, favorites } from "@backend/user";
import emitter from "@backend/events";

import "@css/pages/Home.scss";

class Home extends React.Component {
    update = () => this.forceUpdate();

    componentDidMount() {
        emitter.on("playlist", this.update);
        emitter.on("recent", this.update);
        emitter.on("favorites", this.update);
    }

    componentWillUnmount() {
        emitter.off("playlist", this.update);
        emitter.off("recent", this.update);
        emitter.off("favorites", this.update);
    }

    render() {
        if (playlists.length > 0 || recents.length > 0 || favorites.length > 0) {
            return (
                <AnimatedView className={"Home"}>
                    { playlists.length > 0 && <Playlists /> }
                    <div className={"Home_Column2"}>
                        { recents.length > 0 && <Recents /> }
                        { favorites.length > 0 && <Favorites /> }
                    </div>
                </AnimatedView>
            );
        } else {
            return (
                <AnimatedView className={"empty"}>
                    <h1>No Content</h1>
                    <p>Start using the app to fill up your Home page.</p>
                </AnimatedView>
            );
        }
    }
}

export default Home;
