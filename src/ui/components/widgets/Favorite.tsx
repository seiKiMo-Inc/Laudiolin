import React from "react";

import { TrackData } from "@backend/types";
import { playTrack } from "@backend/audio";

interface IProps {
    track: TrackData;
}

class Favorite extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    /**
     * Plays this track.
     */
    play = (): void => {
        const track = this.props.track;
        track && playTrack(track, true, true);
    }

    render() {
        const { track } = this.props;

        return (
            <div className={"Home_FavoritesTrack"} onClick={this.play}>
                <img src={track.icon} alt={track.title} />
                <p>{track.title}</p>
            </div>
        );
    }
}

export default Favorite;
