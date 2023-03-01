import React from "react";

import { RiHeartFill } from "react-icons/ri";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

import PlaylistItem from "@widget/Playlist";
import NavLink from "@components/NavLink";
import BasicButton from "@components/common/BasicButton";

import { Playlist } from "@backend/types";
import emitter from "@backend/events";
import { playlists } from "@backend/user";

interface IState {
    playlists: Playlist[];
}

class Playlists extends React.Component<any, IState> {
    /**
     * Playlist update callback.
     * @param playlists The new playlists.
     */
    update = (playlists: Playlist[]) => this.setState({ playlists: playlists.slice(0, 6) });

    /**
     * Clears all playlists.
     */
    clear = () => this.setState({ playlists: [] });

    constructor(props: any) {
        super(props);

        this.state = {
            playlists: []
        }
    }

    scrollTo = (direction: "left" | "right") => {
        const playlists = document.getElementsByClassName("Home_Playlists")[0];
        if (direction === "left") {
            playlists.scrollLeft -= 300;
        } else {
            playlists.scrollLeft += 300;
        }
    }

    componentDidMount() {
        this.setState({ playlists: playlists.slice(0, 6) });
        emitter.on("playlist", this.update);
        emitter.on("logout", this.clear);
    }

    componentWillUnmount() {
        emitter.off("playlist", this.update);
        emitter.off("logout", this.clear);
    }

    render() {
        return (
            <div className={"Home_Playlists"}>
                <BasicButton
                    onClick={() => this.scrollTo("left")}
                    icon={<BiChevronLeft />}
                    className={"Home_PlaylistScroll"}
                />

                <NavLink to={"Favorites"}>
                    {() => (
                        <div className={"Home_PlaylistFavorites"}>
                            <RiHeartFill />
                            <h3>Favorites</h3>
                        </div>
                    )}
                </NavLink>

                {this.state.playlists.map((playlist: Playlist) => (
                    <NavLink to={"Playlist"} with={playlist} key={playlist.id}>
                        {() => (<PlaylistItem playlist={playlist} />)}
                    </NavLink>
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
