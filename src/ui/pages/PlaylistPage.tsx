import React from "react";

import PlaylistTracks from "@components/playlist/PlaylistTracks";

interface IProps {}
interface IState {}

const tracks = ["cool track"];

class PlaylistPage extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <PlaylistTracks tracks={tracks} />
            </>
        );
    }
}

export default PlaylistPage;
