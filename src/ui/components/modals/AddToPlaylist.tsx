import React from "react";

import BasicButton from "@components/common/BasicButton";
import BasicDropdown, { toggleDropdown } from "@components/common/BasicDropdown";
import BasicModal from "@components/common/BasicModal";

import { useGlobal, usePlaylists } from "@backend/stores";
import { addTrackToPlaylist, fetchPlaylist } from "@backend/core/playlist";
import Alert from "@components/Alert";

function AddToPlaylist() {
    const playlists = Object.values(usePlaylists());
    const { track } = useGlobal();

    const [selectedId, setSelectedId] = React.useState<string | null>();
    const [selectedName, setSelectedName] = React.useState<string | null>();

    if (!track) return undefined;

    return (
        <BasicModal
            id={`Track_${track.id}_Playlist`}
            buttonText={"Add to Playlist"}
            onSubmit={async () => {
                // Add the track to the playlist.
                const playlist = await fetchPlaylist(selectedId);
                if (!playlist) {
                    setSelectedId(null);
                    setSelectedName(null);
                    return null;
                }

                // Check if the track is already in the playlist.
                if (playlist.tracks.find(t => t.id === track.id)) {
                    Alert.showAlert("Track is already in this playlist.");
                    return null;
                }

                playlist.tracks.push(track);
                await addTrackToPlaylist(selectedId, track);
                Alert.showAlert("Added track to playlist.");

                setSelectedId(null);
                setSelectedName(null);

                return selectedId;
            }}
            hasResult={true}
            style={{ alignItems: "center" }}
        >
            <h1>Select a Playlist</h1>

            <BasicButton
                id={`AddTrack_${track.id}_Button dropbtn`}
                className={`Track_Button`}
                text={selectedName ?? "Select a Playlist"}
                onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(`AddTrack_${track.id}`);
                }}
            />

            <BasicDropdown
                id={`AddTrack_${track.id}`}
                className={`Track_${track.id}`}
            >
                {
                    playlists.map((playlist, index) => {
                        return (
                            <a
                                key={index}
                                onClick={() => {
                                    setSelectedId(playlist.id);
                                    setSelectedName(playlist.name);
                                }}
                            >{playlist.name}</a>
                        );
                    })
                }
            </BasicDropdown>
        </BasicModal>
    );
}

export default AddToPlaylist;
