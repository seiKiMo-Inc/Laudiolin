import React from "react";

import * as types from "@backend/types";

interface IProps {
    pageArgs: any;
}

class Playlist extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const args = this.props.pageArgs;
        if (!args) return undefined;
        const playlist = args as types.Playlist;

        return (
            <div>
                <p>Playlist</p>
                { this.props.pageArgs && playlist.id }
            </div>
        );
    }
}

export default Playlist;
