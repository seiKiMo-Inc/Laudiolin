import React from "react";

import TrackList from "@components/TrackList";

import { recents } from "@backend/user";

class Recents extends React.Component {
    render() {
        return (
            <div className={"Home_Recents"}>
                <TrackList
                    title={"Recently Played"}
                    events={["login", "recent"]}
                    collection={() => recents.slice(0, 10)}
                    padding={0}
                />
            </div>
        );
    }
}

export default Recents;
