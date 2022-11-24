import React from "react";
import { Link } from "react-router-dom";

import { TrackData } from "@backend/types";
import { player, playFromResult } from "@backend/audio";

import Button from "@components/common/Button";
import { displayModal } from "@components/common/Modal";
import { faPause, faPlay, faAdd, faShare, faCopy, faDownload, faDeleteLeft } from "@fortawesome/free-solid-svg-icons";

import "@css/Playlist.scss";

interface IProps {
    track: TrackData;
    setTrack: () => void;
    removeTrack: () => void;
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

    openTrackSource = () => {
        window.open(this.props.track.url, "_blank");
    };

    copyTrackURL = async () => {
        await navigator.clipboard.writeText(this.props.track.url);
    };

    render() {
        const track = this.props.track;
        return (
            <div className="PlaylistTrack" key={track.id} onClick={this.props.setTrack}>

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
                        <Button icon={faAdd} className="TrackOptionsButtons" tooltip="Add to playlist" onClick={() => displayModal("PlaylistTrackAddModal")} />
                        <Button icon={faDeleteLeft} className="TrackOptionsButtons" tooltip="Remove track" onClick={this.props.removeTrack} />
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
