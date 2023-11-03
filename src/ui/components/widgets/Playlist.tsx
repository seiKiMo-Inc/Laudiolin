import React from "react";

import { Playlist } from "@app/types";

import "@css/components/Playlist.scss";

interface IProps {
    playlist: Playlist;
}

class PlaylistItem extends React.Component<IProps> {
    render() {
        return (
            <div className={"Home_PlaylistItem"}>
                <img src={this.props.playlist?.icon} alt={this.props.playlist.name} />
                <div>
                    <h3>{this.props.playlist.name}</h3>
                    <p>{this.props.playlist.description}</p>
                </div>
            </div>
        );
    }
}

export default PlaylistItem;
