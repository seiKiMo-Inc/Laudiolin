import React, { useEffect } from "react";

import { IoMdPlay } from "react-icons/io";
import { VscEllipsis } from "react-icons/vsc";
import { MdFavorite, MdShuffle } from "react-icons/md";

import Track from "@components/Track";
import BasicButton from "@components/common/BasicButton";

import * as types from "@backend/types";
import { playPlaylist } from "@backend/audio";
import { getPlaylistAuthor } from "@backend/user";

import "@css/pages/Playlist.scss";

interface IProps {
    pageArgs: any;
}

function PlaylistAuthor(props: { playlist: types.Playlist }) {
    const playlist = props.playlist;
    const [author, setAuthor] = React.useState<types.PlaylistAuthor>(null);

    useEffect(() => {
        (async () => {
            setAuthor(await getPlaylistAuthor(playlist));
        })();
    }, []);

    return playlist ? (
        <div className={"Playlist_Author"}>
            <img
                className={"profile"}
                alt={playlist.owner}
                src={author?.icon ?? ""}
            />

            <p className={"username"}>{author?.name ?? ""}</p>
        </div>
    ) : undefined;
}

class Playlist extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    /**
     * Fetches the playlist from the page arguments.
     */
    getPlaylist(): types.Playlist {
        const args = this.props.pageArgs;
        if (!args) return undefined;
        return args as types.Playlist;
    }

    /**
     * Plays the playlist.
     * @param shuffle Whether to shuffle the playlist.
     */
    play(shuffle = false): void {
        playPlaylist(this.getPlaylist(), shuffle);
    }

    render() {
       const playlist = this.getPlaylist();
       if (!playlist) return undefined;

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

                       <PlaylistAuthor playlist={playlist} />

                       <div className={"Playlist_Actions"}>
                           <BasicButton
                               className={"action"}
                               icon={<IoMdPlay />}
                               onClick={() => this.play()}
                           />

                           <BasicButton
                               className={"action"}
                               icon={<MdShuffle />}
                               onClick={() => this.play(true)}
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
