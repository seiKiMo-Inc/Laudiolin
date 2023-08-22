import React from "react";
import { Routes, Route } from "react-router-dom";

import { contentRoutes } from "@app/constants";

import Home from "@pages/Home";
import Favorites from "@pages/Favorites";
import Search from "@pages/Search";
import Settings from "@pages/Settings";
import Playlist from "@pages/Playlist";
import Downloads from "@pages/Downloads";
import Queue from "@pages/Queue";
import Recents from "@pages/Recents";
import Login from "@widget/Login";
import Elixir from "@pages/Elixir";

class MainView extends React.Component<any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className={"MainView"}>
                <Routes>
                    <Route path={contentRoutes.HOME} element={<Home />} />
                    <Route path={contentRoutes.FAVORITES} element={<Favorites />} />
                    <Route path={contentRoutes.SEARCH} element={<Search />} />
                    <Route path={contentRoutes.SETTINGS} element={<Settings />} />
                    <Route path={contentRoutes.PLAYLIST} element={<Playlist />} />
                    <Route path={contentRoutes.DOWNLOADS} element={<Downloads />} />
                    <Route path={contentRoutes.QUEUE} element={<Queue />} />
                    <Route path={contentRoutes.RECENTS} element={<Recents />} />
                    <Route path={contentRoutes.LOGIN} element={<Login />} />
                    <Route path={contentRoutes.ELIXIR} element={<Elixir />} />
                </Routes>
            </div>
        );
    }
}

export default MainView;
