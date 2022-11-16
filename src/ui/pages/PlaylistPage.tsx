import React from "react";
import { useParams } from 'react-router-dom';

import { Playlist } from "@backend/types";
import { fetchPlaylist } from "@backend/audio";

import AnimatePages from "@components/common/AnimatePages";
import PlaylistTracks from "@components/playlist/PlaylistTracks";

import "@css/Playlist.scss";

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
                <div className="PlaylistContainer">
                    <div className="PlaylistHeader">
                        <div className="PlaylistHeaderBG" style={{ backgroundImage: `url(${this.state.playlist.icon})` }}></div>
                        <img src={this.state.playlist.icon} className="PlaylistIcon" alt={this.state.playlist.name}/>
                        <div className="PlaylistHeaderInfo">
                            <h2>{this.state.playlist.name}</h2>
                            <p>{this.state.playlist.description}</p>
                        </div>
                    </div>
                    <div className="PlaylistContent">
                        <PlaylistTracks tracks={this.state.playlist.tracks} />
                    </div>
                </div>
            </AnimatePages>
        );
    }
}

export default withRouter(PlaylistPage)
