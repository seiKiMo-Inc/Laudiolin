import React from "react";

import PlaylistTrack from "@components/playlist/PlaylistTrack";

interface IProps {

}

class PlaylistTracks extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <>
                {
                    this.props.tracks.map((track, index) => {
                        return <PlaylistTrack key={index} track={track} />;
                    })
                }
            </>
        );
    }
}

export default PlaylistTracks;