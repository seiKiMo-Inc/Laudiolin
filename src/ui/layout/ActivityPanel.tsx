import React from "react";

import User from "@widget/User";

import type { OfflineUser, OnlineUser } from "@backend/types";

import "@css/layout/ActivityPanel.scss";
import { getAvailableUsers, getRecentUsers } from "@backend/social";
import emitter from "@backend/events";

interface IState {
    offlineUsers: OfflineUser[];
    onlineUsers: OnlineUser[];
}

class ActivityPanel extends React.Component<{}, IState> {
    /**
     * Updates the list of users.
     */
    update = async () => {
        const availableUsers = await getAvailableUsers();
        const recentUsers = await getRecentUsers();

        // check if the user is in both lists
        const offlineUsers = recentUsers.filter(user => availableUsers.find(u => u.userId == user.userId) == undefined);

        this.setState({
            offlineUsers,
            onlineUsers: availableUsers
        });
    };

    /**
     * Reloads the component.
     */
    reload = () => this.forceUpdate();

    interval: NodeJS.Timer|number;

    constructor(props: {}) {
        super(props);

        this.state = {
            offlineUsers: [],
            onlineUsers: []
        };
    }

    componentDidMount() {
        this.update();

        this.interval = setInterval(this.update, 10e3);
        emitter.on("listen", this.reload);
    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
        emitter.off("listen", this.reload);
    }

    render() {
        return (
            <div className={"ActivityPanel"}>
                <div className={"ActivityPanel_Info"}>
                    <h3 style={{ paddingBottom: 20 }}>Now Active</h3>
                    <div className={"ActivityPanel_Content"}>
                        { this.state.onlineUsers.map((user, index) =>
                            <User user={user as OnlineUser & OfflineUser} key={index} />) }
                    </div>
                </div>

                <div className={"ActivityPanel_Info"}>
                    <h3 style={{ paddingBottom: 20 }}>Recently Active</h3>
                    <div className={"ActivityPanel_Content"}>
                        { this.state.offlineUsers.map((user, index) =>
                            <User user={user as OnlineUser & OfflineUser} isOffline={true} key={index} />) }
                    </div>
                </div>
            </div>
        );
    }
}

export default ActivityPanel;
