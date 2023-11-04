import React from "react";

import AnimatedView from "@components/common/AnimatedView";
import TrackList from "@components/TrackList";

import { favorites } from "@backend/social/user";

class Favorites extends React.Component {
    render() {
        return favorites.length > 0 ? (
            <AnimatedView>
                <TrackList
                    title={"Favorites"}
                    events={["login", "favorite"]}
                    collection={() => favorites}
                />
            </AnimatedView>
        ) : (
            <AnimatedView className={"empty"}>
                <h1>No Favorites</h1>
                <p>Mark tracks as favorite for them to appear here.</p>
            </AnimatedView>
        );
    }
}

export default Favorites;
