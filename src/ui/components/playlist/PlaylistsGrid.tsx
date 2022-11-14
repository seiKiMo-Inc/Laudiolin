import React from "react";
import { Playlist } from "@backend/types";
import { fetchPlaylists } from "@backend/audio";
import { Card } from "react-bootstrap";

import "@css/Playlist.scss"

interface IState {
    playlists: Playlist[];
}

class PlaylistsGrid extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            playlists: []
        }
    }

    cardClick = (playlist: Playlist) => {
        // this.props.history.push(`/playlist/${playlist.id}`);
        // TODO: Make playlist pages.
        console.log(playlist.name);
    }

    componentDidMount() {
        fetchPlaylists().then((playlists) => {
            this.setState({ playlists: playlists });
        });
    }

    render() {
        return (
            <span className="PlaylistsGrid">
                {this.state.playlists.map((playlist) => {
                    return (
                        <Card key={playlist.id} className="PlaylistCards" onClick={() => this.cardClick(playlist)}>
                            <Card.Img variant="top" src={playlist.icon} />
                            <Card.Body className="PlaylistCardText">
                                <Card.Title>{playlist.name}</Card.Title>
                            </Card.Body>
                        </Card>
                    );
                })}
            </span>
        );
    }
}

export default PlaylistsGrid;