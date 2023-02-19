import React from "react";

import { BiHeart } from "react-icons/bi";

import "@css/components/Track.scss";

class Track extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"Track"}>
                <img
                    className={"Track_Icon"}
                    src={"https://app.seikimo.moe/proxy/UTSE1F-N2H4bljnWAg0uwtD4l1JV4jQQyXE6hukkuV3CjnO4dWDhGAEvQ-3WAu5miiDk5gKV9FZDvywH=w544-h544-l90-rj?from=cart"}
                />

                <div className={"Track_Info"}>
                    <p>Hikaru Nara</p>
                    <p>Artist Name</p>
                </div>

                <div className={"Track_Interact"}>
                    <BiHeart />
                </div>
            </div>
        );
    }
}

export default Track;
