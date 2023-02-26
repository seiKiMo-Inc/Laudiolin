import React from "react";

import AnimatedView from "@components/common/AnimatedView";
import TrackList from "@components/TrackList";

import { favorites } from "@backend/user";

class Favorites extends React.Component {
    render() {
        return (
            <AnimatedView>
                <TrackList
                    title={"Favorites"}
                    events={["login", "favorite"]}
                    collection={() => favorites}
                />
            </AnimatedView>
        );
    }
}

export default Favorites;
