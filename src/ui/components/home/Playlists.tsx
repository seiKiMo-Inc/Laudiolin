import React from "react";
import { Link } from "react-router-dom";

import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

import PlaylistItem from "@widget/Playlist";
import BasicButton from "@components/common/BasicButton";

import { Playlist } from "@app/types";
import { contentRoutes } from "@app/constants";

interface IProps {
    playlists: Playlist[];
}

class Playlists extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    scrollTo = (direction: "left" | "right") => {
        const playlists = document.getElementsByClassName("Home_Playlists")[0];
        if (direction === "left") {
            playlists.scrollLeft -= 300;
        } else {
            playlists.scrollLeft += 300;
        }
    }

    render() {
        return (
            <div className={"Home_Playlists"}>
                <BasicButton
                    onClick={() => this.scrollTo("left")}
                    icon={<BiChevronLeft />}
                    className={"Home_PlaylistScroll"}
                />

                {this.props.playlists.map((playlist: Playlist) => (
                    <Link
                        to={`${contentRoutes.PLAYLIST.substring(0, contentRoutes.PLAYLIST.length - 3)}${playlist.id}`}
                        key={playlist.id}
                        style={{ textDecoration: "none" }}
                    >
                        <PlaylistItem playlist={playlist} />
                    </Link>
                ))}

                <BasicButton
                    onClick={() => this.scrollTo("right")}
                    icon={<BiChevronRight />}
                    className={"Home_PlaylistScroll"}
                />
            </div>
        );
    }
}

export default Playlists;
