import React from "react";

import AnimatedView from "@components/common/AnimatedView";
import TrackList from "@components/TrackList";

import TrackPlayer from "@mod/player";

class Queue extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <AnimatedView>
                <TrackList
                    title={"Queue"}
                    events={[
                        "play",
                        "stop",
                        "destroy",
                        "end",
                        "shuffle",
                        "queue"
                    ]}
                    collection={() => TrackPlayer.getQueue()}
                    emitter={TrackPlayer}
                    queue={true}
                />
            </AnimatedView>
        );
    }
}

export default Queue;
