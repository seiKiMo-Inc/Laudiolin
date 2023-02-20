import React from "react";

import NavLink from "@components/NavLink";

import { Playlist } from "@backend/types";
import emitter from "@backend/events";

import "@css/layout/NavPanel.scss"

interface IState {
    playlists: Playlist[];
}

class Playlists extends React.Component<any, IState> {
    /**
     * Playlist update callback.
     * @param playlists The new playlists.
     */
    update = (playlists: Playlist[]) =>
        this.setState({ playlists });

    constructor(props: {}) {
        super(props);

        this.state = {
            playlists: []
        };
    }

    componentDidMount() {
        emitter.on("playlist", this.update);
    }

    componentWillUnmount() {
        emitter.off("playlist", this.update);
    }

    render() {
        const { playlists } = this.state;

        return playlists.length > 0 ? (
            <>
                <div className={"Playlists_Divider"} />
                <h3 className={"Playlists_Header"}>Your Playlists</h3>

                <div className={"Playlists_Container"}>
                    { playlists.map(playlist => (
                        <NavLink
                            to={"Playlist"} with={playlist}
                            className={"Playlists_Item"} key={playlist.id}
                        >
                            {({ isActive }) => <p style={{ color: isActive && "var(--text=primary-color)" }}>
                                {playlist.name}
                            </p>}
                        </NavLink>
                    ))}
                </div>
            </>
        ) : null;
    }
}

export default Playlists;
