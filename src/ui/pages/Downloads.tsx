import React from "react";

import AnimatedView from "@components/common/AnimatedView";
import TrackList from "@components/TrackList";

import { downloads } from "@backend/desktop/offline";

class Downloads extends React.Component {
    render() {
        return downloads.length > 0 ? (
            <AnimatedView>
                <TrackList
                    title={"Downloads"}
                    events={["login", "downloads"]}
                    collection={() => downloads}
                />
            </AnimatedView>
        ) : (
            <AnimatedView className={"empty"}>
                <h1>No Downloads</h1>
                <p>Downloaded tracks will appear here.</p>
            </AnimatedView>
        );
    }
}

export default Downloads;
