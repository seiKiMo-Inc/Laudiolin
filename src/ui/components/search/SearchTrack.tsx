import React from "react";
import { Figure } from "react-bootstrap";
import Button from "@components/Button";

import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { player, playFromResult } from "@backend/audio";

import type { SearchResult } from "@backend/types";

import "@css/SearchTrack.scss";

interface IProps {
    result: SearchResult;
}
interface IState {
    playing: boolean;
    hasPlayed: boolean;
}

/* A track that appears when searching for it. */
class SearchTrack extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            playing: false,
            hasPlayed: false
        };
    }

    componentDidMount() {
        // Listen for player events.
        player.on("stop", () => {
            if(!this.state.hasPlayed) return;
            this.setState({
                playing: !this.state.playing,
                hasPlayed: !this.state.hasPlayed
            });
        });
    }

    playTrack = () => {
        const hasPlayed = this.state.hasPlayed;
        const isPlaying = this.state.playing;

        if(hasPlayed) {
            player.togglePlayback(); // Pause/resume the player.
            this.setState({ playing: !isPlaying });
        } else {
            // Check if the player is currently playing.
            if(player.isPlaying()) player.stopTrack();
            this.setState({ hasPlayed: true });

            // Play the track from the specified result.
            playFromResult(this.props.result).then(() => {
                // Change the state to playing.
                this.setState({ playing: !isPlaying });
            });
        }
    };

    preview = () => {
        alert("This should bring the user to a laudiolin-based song preview.");
    };

    render() {
        const result = this.props.result;

        return (
            <div className="SearchResult list-group-item dark:text-white dark:bg-slate-800" key={result.id}>
                <Figure id="figure">
                    <Figure.Caption id="statusButton">
                        <Button icon={
                            this.state.hasPlayed ?
                                this.state.playing ?
                                    faPause : faPlay
                                : faPlay
                        } onClick={this.playTrack} />
                    </Figure.Caption>

                    <a onClick={this.preview}>
                        <Figure.Image src={result.icon} id="image" />
                    </a>

                    <Figure.Caption className="Title result-title">
                        <a onClick={this.preview}>
                            <span>{result.title}</span>
                        </a>

                        <p className="text-gray-600">{result.artist}</p>
                    </Figure.Caption>
                </Figure>
            </div>
        );
    }
}

export default SearchTrack;