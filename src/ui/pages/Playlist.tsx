import React from "react";

import { IoMdPlay } from "react-icons/io";
import { VscEllipsis } from "react-icons/vsc";
import { MdFavorite, MdShuffle } from "react-icons/md";

import Track from "@components/Track";
import BasicButton from "@components/common/BasicButton";

import * as types from "@backend/types";

import "@css/pages/Playlist.scss";

interface IProps {
    pageArgs: any;
}

class Playlist extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const args = this.props.pageArgs;
        if (!args) return undefined;
        const playlist = args as types.Playlist;

        return (
            <div>
                <div className={"Playlist_Details"}>
                    <img
                        className={"icon"}
                        alt={playlist.name}
                        src={playlist.icon}
                    />

                    <div className={"info"}>
                        <p style={{ textTransform: "uppercase", paddingTop: 28 }}>
                            {playlist.isPrivate ? "Private Playlist" : "Public Playlist"}
                        </p>

                        <h1>{playlist.name}</h1>

                        <div className={"Playlist_Author"}>
                            <img
                                className={"profile"}
                                alt={playlist.owner}
                                src={playlist.icon}
                            />

                            <p className={"username"}>{playlist.owner}</p>
                        </div>

                        <div className={"Playlist_Actions"}>
                            <BasicButton
                                className={"action"}
                                icon={<IoMdPlay />}
                            />

                            <BasicButton
                                className={"action"}
                                icon={<MdShuffle />}
                            />
                        </div>
                    </div>
                </div>

                <div className={"Playlist_Interact"}>
                    <BasicButton
                        className={"edit"}
                        text={"Edit Playlist"}
                    />

                    <div className={"buttons"}>
                        <BasicButton
                            icon={<MdFavorite />}
                        />

                        <BasicButton
                            icon={<VscEllipsis />}
                        />
                    </div>
                </div>

                <div className={"Playlist_Tracks"}>
                    {
                        playlist.tracks.map((track, index) =>
                            <Track track={track} key={index} />)
                    }
                </div>
            </div>
        );
    }
}

export default Playlist;
