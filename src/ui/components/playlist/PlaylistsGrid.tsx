import React from "react";
import { Playlist } from "@backend/types";
import { fetchAllPlaylists } from "@backend/audio";

import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

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
        fetchAllPlaylists().then((playlists) => {
            this.setState({ playlists: playlists });
        });
    }

    render() {
        if (this.state.playlists.length == 0) {
            return <h2 id="NoPlaylistMessage">No playlists found.</h2>
        }
        return (
            <span className="PlaylistsGrid">
                {this.state.playlists.map((playlist) => {
                    return (
                        <Link to={`/playlist/${playlist.id}`} key={playlist.id}>
                            <Card className="PlaylistCards" onClick={() => this.cardClick(playlist)}>
                                <Card.Img variant="top" src={playlist.icon} />
                                <Card.Body className="PlaylistCardText">
                                    <Card.Title>{playlist.name}</Card.Title>
                                </Card.Body>
                            </Card>
                        </Link>
                    );
                })}
            </span>
        );
    }
}

export default PlaylistsGrid;