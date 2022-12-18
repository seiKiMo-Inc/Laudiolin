import React from "react";
import { Container } from "react-bootstrap";

import SearchTrack from "@components/search/SearchTrack";
import Loader from "@components/common/Loader";
import Modal from "@components/common/Modal";

import type { Playlist, SearchResult, SearchResults } from "@backend/types";
import { addTrackToPlaylist, fetchAllPlaylists, fetchPlaylist } from "@backend/playlist";

interface IProps {
    results: SearchResults;
}

interface IState {
    result: SearchResult;
    playlists: Playlist[];
}

const blankResult: SearchResult = {
    title: "",
    artist: "",
    icon: "",
    url: "",
    id: "",
    duration: 0
}

class SearchResultsList extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            result: blankResult,
            playlists: fetchAllPlaylists()
        };
    }

    hideModal = () => {
        const modal = document.getElementById("SearchModal");
        modal.style.display = "none";
    };

    addToPlaylist = async () => {
        this.hideModal();
        const playlistId = (document.getElementById("SearchModal-PlaylistSelect") as HTMLSelectElement).value;
        if (fetchPlaylist(playlistId).tracks.includes(this.state.result)) {
            return alert("This track is already in this playlist!");
        }

        await addTrackToPlaylist(playlistId, this.state.result);
    };


    componentDidUpdate(prevProps:Readonly<IProps>, prevState:Readonly<IState>) {
        // Scroll to the top of the page when the results change.
        if (prevProps.results !== this.props.results) {
            document.documentElement.scrollTop = 0;
        }
    }

    render() {
        const results = this.props.results.results;

        // Remove duplicate values.
        const uniqueResults = results.filter((result, index, self) => {
            return self.findIndex(r => r.id === result.id) === index;
        });

        return (
            <Container style={{ marginTop: "20px" }}>
                <div className="list-group">
                    {results.length == 0 ? (
                        <Loader />
                    ) : (
                        uniqueResults.map((result) => {
                            return <SearchTrack key={result.id} result={result} onClick={() => this.setState({ result: result })} />;
                        })
                    )}

                    <Modal id="SearchModal" onSubmit={this.addToPlaylist}>
                        <h2>Select Playlist</h2>
                        <select id="SearchModal-PlaylistSelect">
                            {this.state.playlists.map(playlist => {
                                return <option value={playlist.id}>{playlist.name}</option>
                            })}
                        </select>
                    </Modal>

                </div>
            </Container>
        );
    }
}

export default SearchResultsList;
