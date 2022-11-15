import React from "react";
import { TrackData } from "@backend/types";
import PlaylistTrack from "@components/playlist/PlaylistTrack";

import "@css/Playlist.scss";

interface IProps {
    tracks: TrackData[];
}

class PlaylistTracks extends React.Component<IProps, never> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <>
                {this.props.tracks.map((track) => {
                    return (
                        <PlaylistTrack key={track.id} track={track} />
                    );
                })}
            </>
        );
    }
}

export default PlaylistTracks;
