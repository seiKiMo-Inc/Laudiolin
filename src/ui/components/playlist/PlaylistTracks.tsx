import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Playlist, TrackData } from "@backend/types";
import { addTrackToPlaylist, removeTrackFromPlaylist, fetchAllPlaylists, editPlaylist } from "@backend/playlist";
import emitter from "@backend/events";

import PlaylistTrack from "@components/playlist/PlaylistTrack";
import Modal from "@components/common/Modal";

import "@css/Playlist.scss";

interface IProps {
    playlist: Playlist;
}

interface IState {
    track: TrackData;
    tracks: TrackData[];
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
            tracks: this.props.playlist.tracks,
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
        emitter.emit("playlist-update");
    };

    deleteFromPlaylist = async (index) => {
        await removeTrackFromPlaylist(this.props.playlist.id, index);
        emitter.emit("playlist-update");
    }

    handleDragEnd = async (result) => {
        if (!result.destination) return;
        const tracks = this.state.tracks;
        const [removed] = tracks.splice(result.source.index, 1);
        tracks.splice(result.destination.index, 0, removed);
        this.setState({ tracks });
        await editPlaylist({
            ...this.props.playlist,
            tracks: tracks
        });
    }

    componentDidUpdate(prevProps:Readonly<IProps>, prevState:Readonly<IState>) {
        // Scroll to the top of the page when the results change.
        if (prevProps.playlist.tracks !== this.props.playlist.tracks) {
            document.documentElement.scrollTop = 0;
        }
    }

    render() {
        return (
            <>
                <DragDropContext onDragEnd={this.handleDragEnd}>
                    <Droppable droppableId="PlaylistDroppableTracks">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {this.state.tracks.map((track, index) => {
                                    return (
                                        <Draggable key={`${track.id}_${index}`} draggableId={track.id} index={index}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <PlaylistTrack
                                                        key={index}
                                                        track={track}
                                                        setTrack={() => this.setState({ track: track })}
                                                        removeTrack={() => this.deleteFromPlaylist(index)}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <Modal id="PlaylistTrackAddModal" onSubmit={this.addToPlaylist}>
                    <h2>Select Playlist</h2>
                    <select id="PlaylistTrackAddModal-PlaylistSelect">
                        {this.state.playlists.map(playlist => {
                            return <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
                        })}
                    </select>
                </Modal>
            </>
        );
    }
}

export default PlaylistTracks;
