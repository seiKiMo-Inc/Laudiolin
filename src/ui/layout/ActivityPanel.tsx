import React from "react";

import User from "@widget/User";

import type { OfflineUser, OnlineUser } from "@backend/types";
import { getAvailableUsers, getRecentUsers } from "@backend/social";
import emitter from "@backend/events";

import "@css/layout/ActivityPanel.scss";

interface IState {
    offlineUsers: OfflineUser[];
    onlineUsers: OnlineUser[];
}

class ActivityPanel extends React.Component<{}, IState> {
    /**
     * Updates the list of users.
     */
    update = async () => {
        try {
            const availableUsers = await getAvailableUsers();
            const recentUsers = await getRecentUsers();

            // check if the user is in both lists
            const offlineUsers = recentUsers.filter(
                (user) =>
                    availableUsers.find((u) => u.userId == user.userId) == undefined
            );

            this.setState({
                offlineUsers,
                onlineUsers: availableUsers
            });
        } catch {
            this.setState({
                offlineUsers: [],
                onlineUsers: []
            });
        }
    };

    /**
     * Reloads the component.
     */
    reload = () => this.forceUpdate();

    interval: NodeJS.Timer | number;

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
                {
                    (this.state.onlineUsers.length > 0 || this.state.offlineUsers.length > 0) ? (
                        <>
                            {
                                this.state.onlineUsers.length > 0 && (
                                    <div className={"ActivityPanel_Info"}>
                                        <h3 style={{ paddingBottom: 20 }}>Now Active</h3>
                                        <div className={"ActivityPanel_Content"}>
                                            {this.state.onlineUsers.map((user, index) => (
                                                <User
                                                    user={user as OnlineUser & OfflineUser}
                                                    key={index}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )
                            }

                            {
                                this.state.offlineUsers.length > 0 && (
                                    <div className={"ActivityPanel_Info"}>
                                        <h3 style={{ paddingBottom: 20 }}>Recently Active</h3>
                                        <div className={"ActivityPanel_Content"}>
                                            {this.state.offlineUsers.map((user, index) => (
                                                <User
                                                    user={user as OnlineUser & OfflineUser}
                                                    isOffline={true}
                                                    key={index}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )
                            }
                        </>
                    ) : (
                        <h2 className={"ActivityPanel_Empty"}>Hmmmm...<br />&emsp;&emsp;So empty.</h2>
                    )
                }
            </div>
        );
    }
}

export default ActivityPanel;
