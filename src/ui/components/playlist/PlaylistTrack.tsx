import React from "react";
import { Link } from "react-router-dom";

import { TrackData } from "@backend/types";
import { fetchAllPlaylists, player, playFromResult } from "@backend/audio";

import Button from "@components/common/Button";
import { faPause, faPlay, faAdd, faShare, faCopy, faDownload } from "@fortawesome/free-solid-svg-icons";

import "@css/Playlist.scss";

interface IProps {
    track: TrackData;
}

interface IState {
    playing: boolean;
    hasPlayed: boolean;
}

class PlaylistTrack extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            playing: false,
            hasPlayed: false
        }
    }

    playTrack = () => {
        const hasPlayed = this.state.hasPlayed;
        const isPlaying = this.state.playing;

        if (hasPlayed) {
            player.togglePlayback(); // Pause/resume the player.
            this.setState({ playing: !isPlaying });
        } else {
            // Check if the player is currently playing.
            if (player.isPlaying()) player.stopTrack();
            this.setState({ hasPlayed: true });

            playFromResult(this.props.track).then(() => {
                // Change the state to playing.
                this.setState({ playing: !isPlaying });
            });
        }
    };

    preview2 = () => {
        alert("Download the song.");
    }

    // TODO: make adding to playlists work.
    // TODO: make a better pop up menu for playlists.
    addToPlaylist = async () => {
        const playlists = await fetchAllPlaylists();
        const playlistNames = playlists.map(playlist => playlist.name);
        const playlist = prompt("Which playlist would you like to add this track to?", playlistNames.join(", "));
        if (!playlist) return;
        if (!playlistNames.includes(playlist)) {
            alert("That playlist doesn't exist!");
            return;
        }
        alert("This should add the track to the specified playlist.");
    };

    openTrackSource = () => {
        window.open(this.props.track.url, "_blank");
    };

    copyTrackURL = async () => {
        await navigator.clipboard.writeText(this.props.track.url);
    };

    render() {
        const track = this.props.track;
        return (
            <div className="PlaylistTrack" key={track.id}>

                <Button
                    id="statusButton"
                    icon={this.state.hasPlayed ? (this.state.playing ? faPause : faPlay) : faPlay}
                    onClick={this.playTrack}
                />

                <Link to={`/track/${track.id}`} className="trackInfo">
                    <img src={track.icon} className="PlaylistTrackIcon" alt={track.title} />
                </Link>

                <div className="PlaylistTrackText">

                    <Link to={`/track/${track.id}`} className="trackInfo">
                        <h2 className="PlaylistTrackTitle">{track.title}</h2>
                    </Link>
                    <p className="PlaylistTrackAuthor">{track.artist}</p>

                    <div className="PlaylistTrackButtons">
                        <Button icon={faAdd} className="TrackOptionsButtons" tooltip="Add to playlist" onClick={this.addToPlaylist} />
                        <Button icon={faShare} className="TrackOptionsButtons" tooltip="Open track source" onClick={this.openTrackSource} />
                        <Button icon={faCopy} className="TrackOptionsButtons" tooltip="Copy track URL" onClick={this.copyTrackURL} />
                        <Button icon={faDownload} className="TrackOptionsButtons" tooltip="Download track" onClick={this.preview2} />
                    </div>

                </div>

            </div>
        );
    }
}

export default PlaylistTrack;
