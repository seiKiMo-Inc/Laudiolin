import React from "react";

import AnimatedView from "@components/common/AnimatedView";
import TrackList from "@components/TrackList";

import { downloads } from "@backend/offline";

class Downloads extends React.Component {
    render() {
        return (
            <AnimatedView>
                <TrackList
                    title={"Downloads"}
                    events={["login", "downloads"]}
                    collection={() => downloads}
                />
            </AnimatedView>
        );
    }
}

export default Downloads;
