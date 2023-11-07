import React from "react";

import User from "@widget/User";

import emitter from "@backend/events";
import type { OfflineUser, OnlineUser } from "@app/types";
import WithStore, { GlobalState, useGlobal } from "@backend/stores";

import "@css/layout/ActivityPanel.scss";
import { getAvailableUsers, getRecentUsers } from "@backend/features/social";

interface IProps {
    pStore: GlobalState;
}

interface IState {
    offlineUsers: OfflineUser[];
    onlineUsers: OnlineUser[];
}

class ActivityPanel extends React.Component<IProps, IState> {
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

    private interval: any = null;
    private unsubscribe: any = null;

    constructor(props: IProps) {
        super(props);

        this.state = {
            offlineUsers: [],
            onlineUsers: []
        };
    }

    private checkInterval(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        } else {
            this.interval = setInterval(this.update, 15e3);
        }
    }

    componentDidMount() {
        this.update();

        this.props.pStore.activityOpen && this.checkInterval();
        this.unsubscribe = useGlobal.subscribe((state, prevState) => {
            if (state.activityOpen != prevState.activityOpen)
                this.checkInterval();
        });

        emitter.on("listen", this.reload);
        emitter.on("activity:update", this.update.bind(this));
    }

    componentWillUnmount() {
        this.unsubscribe();

        emitter.off("listen", this.reload);
        emitter.off("activity:update", this.update.bind(this));
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
                                                    pStore={user as OnlineUser & OfflineUser}
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
                                                    pStore={user as OnlineUser & OfflineUser}
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
                        <h2 className={"ActivityPanel_Empty"}>Hmmmm...<br />So empty.</h2>
                    )
                }
            </div>
        );
    }
}

export default WithStore(ActivityPanel, useGlobal);
