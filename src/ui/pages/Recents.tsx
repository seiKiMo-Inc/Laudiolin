import React from "react";

import AnimatedView from "@components/common/AnimatedView";
import TrackList from "@components/TrackList";

import { recents } from "@backend/user";

class Recents extends React.Component {
    render() {
        return (
            <AnimatedView>
                <TrackList
                    title={"Recents"}
                    events={["login", "recent"]}
                    collection={() => recents}
                />
            </AnimatedView>
        );
    }
}

export default Recents;
