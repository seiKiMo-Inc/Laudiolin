import React from "react";

import AnimatedView from "@components/common/AnimatedView";
import Playlists from "@components/home/Playlists";

import "@css/pages/Home.scss"

class Home extends React.Component {
    render() {
        return (
            <AnimatedView className={"Home"}>
                <Playlists />
            </AnimatedView>
        );
    }
}

export default Home;
