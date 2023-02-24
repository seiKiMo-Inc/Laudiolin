import React from "react";

import "@css/components/MiniPlayer.scss";
import emitter from "@backend/events";

class MiniPlayer extends React.Component<any, any> {
    render() {
        return (
            <div className={"MiniPlayer"}>
                <a onClick={() => emitter.emit("miniPlayer", false)}>Exit</a>
            </div>
        );
    }
}

export default MiniPlayer;
