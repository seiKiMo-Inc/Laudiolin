import React from "react";

import { toMini } from "@app/utils";

import "@css/components/MiniPlayer.scss";

class MiniPlayer extends React.Component<any, any> {
    render() {
        return (
            <div className={"MiniPlayer"}>
                <a onClick={() => toMini(false)}>Exit</a>
            </div>
        );
    }
}

export default MiniPlayer;
