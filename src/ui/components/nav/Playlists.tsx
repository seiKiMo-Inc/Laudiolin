import React from "react";

import NavLink from "@components/NavLink";

import { Playlist } from "@backend/types";
import emitter from "@backend/events";

import "@css/layout/NavPanel.scss"

interface IState {
    playlists: Playlist[];
}

class Playlists extends React.Component<any, IState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            playlists: []
        }
    }

    componentDidMount() {
        emitter.on("playlist", (playlists) => {
           this.setState({ playlists })
        });
    }

    render() {
        return this.state.playlists.length > 0 ? (
            <>
                <div className={"Playlists_Divider"} />
                <h3 className={"Playlists_Header"}>Your Playlists</h3>

                <div className={"Playlists_Container"}>
                    { this.state.playlists.map((playlist) => (
                        <NavLink to={"Playlist"} with={{ id: "1" }} className={"Playlists_Item"}>
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
