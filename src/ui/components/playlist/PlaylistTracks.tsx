import React from "react";
import { Playlist, TrackData } from "@backend/types";
import PlaylistTrack from "@components/playlist/PlaylistTrack";

import "@css/Playlist.scss";
import Modal from "@components/common/Modal";
import { addTrackToPlaylist, fetchAllPlaylists } from "@backend/playlist";

interface IProps {
    tracks: TrackData[];
}

interface IState {
    track: TrackData;
    playlists: Playlist[];
}

const blankTrack: TrackData = {
    title: "",
    artist: "",
    icon: "",
    url: "",
    id: "",
    duration: 0
}

class PlaylistTracks extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            track: blankTrack,
            playlists: fetchAllPlaylists()
        }
    }

    hideModal = () => {
        const modal = document.getElementById("PlaylistTrackAddModal");
        modal.style.display = "none";
    };

    addToPlaylist = async () => {
        this.hideModal();
        const playlistId = (document.getElementById("PlaylistTrackAddModal-PlaylistSelect") as HTMLSelectElement).value;
        await addTrackToPlaylist(playlistId, this.state.track);
    };

    componentDidUpdate() {
        // Scroll to the top of the page when the results change.
        document.documentElement.scrollTop = 0;
    }

    render() {
        return (
            <>
                {this.props.tracks.map((track) => {
                    return (
                        <PlaylistTrack key={track.id} track={track} onClick={() => this.setState({ track: track })} />
                    );
                })}

                <Modal id="PlaylistTrackAddModal" onSubmit={this.addToPlaylist}>
                    <h2>Select Playlist</h2>
                    <select id="PlaylistTrackAddModal-PlaylistSelect">
                        {this.state.playlists.map(playlist => {
                            return <option value={playlist.id}>{playlist.name}</option>
                        })}
                    </select>
                </Modal>
            </>
        );
    }
}

export default PlaylistTracks;
