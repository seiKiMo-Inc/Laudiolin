import React from "react";

import AnimatedView from "@components/common/AnimatedView";
import TrackList from "@components/TrackList";

import TrackPlayer from "@mod/player";

import "@css/pages/Queue.scss";
import { FaRegTrashAlt } from "react-icons/fa";

class Queue extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return TrackPlayer.getQueue().length > 0 ? (
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
                >
                    <button
                        className={"Queue_Clear"}
                        onClick={() => {
                            TrackPlayer.getQueue().length = 0;
                            this.forceUpdate(); // Reload the page.
                        }}
                    >
                        <FaRegTrashAlt />
                        Clear
                    </button>
                </TrackList>
            </AnimatedView>
        ) : (
            <AnimatedView className={"empty"}>
                <h1>No Song In Queue</h1>
                <p>Go queue a song.</p>
            </AnimatedView>
        );
    }
}

export default Queue;
