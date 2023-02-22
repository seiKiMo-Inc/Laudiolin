import React from "react";

import User from "@widget/User";

import type { BasicUser, TrackData } from "@backend/types";

import "@css/layout/ActivityPanel.scss";
import { getAvailableUsers } from "@backend/social";

interface IState {
    users: BasicUser[];
    tracks: TrackData[];
    name: string;
}

class ActivityPanel extends React.Component<{}, IState> {
    /**
     * Updates the list of users.
     */
    update = async () => {
        const users = await getAvailableUsers(true);
        this.setState({ users });
    };

    interval: NodeJS.Timer|number;

    constructor(props: {}) {
        super(props);

        this.state = {
            users: [],
            tracks: [],
            name: "Activity"
        };
    }

    componentDidMount() {
        this.interval = setInterval(this.update, 10e3);
    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }

    render() {
        return (
            <div className={"ActivityPanel"}>
                <div className={"ActivityPanel_Info"}>
                    <h3>{this.state.name}</h3>
                </div>

                <div className={"ActivityPanel_Content"}>
                    { this.state.tracks && this.state.tracks.map((track, index) =>
                        <p>{track.title}</p>) }
                    { this.state.users && this.state.users.map((user, index) =>
                        <User user={user} key={index} />) }
                </div>
            </div>
        );
    }
}

export default ActivityPanel;
