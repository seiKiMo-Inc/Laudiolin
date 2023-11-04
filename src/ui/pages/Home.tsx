import React from "react";

import AnimatedView from "@components/common/AnimatedView";
import Playlists from "@components/home/Playlists";
import Recents from "@components/home/Recents";
import Favorites from "@components/home/Favorites";

import { Playlist, TrackData } from "@app/types";

import WithStore, { usePlaylists, useRecents, useFavorites } from "@backend/stores";

import "@css/pages/Home.scss";

interface IProps {
    pStore: Playlist[];
    sStore: TrackData[];
    tStore: TrackData[];
}

class Home extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { pStore: playlistsObj, sStore: recentsObj, tStore: favoritesObj } = this.props;

        const playlists = Object.values(playlistsObj);
        const recents = Object.values(recentsObj);
        const favorites = Object.values(favoritesObj);

        if (playlists.length > 0 || recents.length > 0 || favorites.length > 0) {
            return (
                <AnimatedView className={"Home"}>
                    { playlists.length > 0 && <Playlists playlists={playlists} /> }
                    <div className={"Home_Column2"}>
                        { recents.length > 0 && <Recents recents={recents} /> }
                        { favorites.length > 0 && <Favorites favorites={favorites} /> }
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

export default WithStore(Home, usePlaylists, useRecents, useFavorites);
