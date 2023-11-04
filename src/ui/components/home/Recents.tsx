import React from "react";

import { TrackData } from "@app/types";

import TrackList from "@components/TrackList";

interface IProps {
    recents: TrackData[];
}

class Recents extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div className={"Home_Recents"}>
                <TrackList
                    title={"Recently Played"}
                    events={["login", "recent"]}
                    collection={() => this.props.recents.slice(0, 10)}
                    padding={0}
                />
            </div>
        );
    }
}

export default Recents;
