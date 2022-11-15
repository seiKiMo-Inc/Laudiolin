import React from "react";
import { useParams } from 'react-router-dom';

import { Playlist } from "@backend/types";
import { fetchPlaylist } from "@backend/audio";

import AnimatePages from "@components/AnimatePages";
import { Container } from "react-bootstrap";

interface IState {
    playlist: Playlist;
}

export function withRouter(Children: React.ComponentClass) {
    return(props) => {
        const match  = { params: useParams() };
        return <Children {...props}  match={match}/>
    }
}

class PlaylistPage extends React.Component<any, IState> {
    constructor(props) {
        super(props);

        this.state = {
            playlist: null
        }
    }

    componentDidMount() {
        fetchPlaylist(this.props.match.params.id).then((playlist) => {
            this.setState({ playlist: playlist });
        });
    }

    render() {
        if (this.state.playlist == null) {
            return <h2 id="NoPlaylistMessage">No playlists found.</h2>
        }
        return (
            <AnimatePages>
                <Container className="PlaylistContainer">
                    <div className="PlaylistHeader">
                        <img src={this.state.playlist.icon} className="PlaylistIcon" alt={this.state.playlist.name}/>
                        <div className="PlaylistTitleText">
                            <h2>{this.state.playlist.name}</h2>
                            <h2>{this.state.playlist.description}</h2>
                        </div>
                    </div>
                    <div className="PlaylistContent">
                        <h2>Playlist content</h2>
                        {this.state.playlist.tracks.map((track) => {
                            return (
                                <div className="PlaylistTrack" key={track.id}>
                                    <img src={track.icon} className="PlaylistTrackIcon" alt={track.title}/>
                                    <div className="PlaylistTrackText">
                                        <h2 className="PlaylistTrackTitle">{track.title}</h2>
                                        <h3 className="PlaylistTrackAuthor">{track.artist}</h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Container>
            </AnimatePages>
        );
    }
}

export default withRouter(PlaylistPage)
