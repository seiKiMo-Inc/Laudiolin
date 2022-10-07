import React from "react";

import { TrackData } from "@backend/types";

interface IProps {
    track: TrackData;
}

class PlaylistTrack extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <>
                <a>asdf</a>
            </>
        );
    }
}

export default PlaylistTrack;