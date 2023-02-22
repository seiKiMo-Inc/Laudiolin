import React from "react";

import User from "@widget/User";

import type { BasicUser } from "@backend/types";

import "@css/layout/ActivityPanel.scss";
import { getAvailableUsers } from "@backend/social";
import emitter from "@backend/events";

interface IState {
    users: BasicUser[];
}

class ActivityPanel extends React.Component<{}, IState> {
    /**
     * Updates the list of users.
     */
    update = async () => {
        const users = await getAvailableUsers(true);
        this.setState({ users });
    };

    /**
     * Reloads the component.
     */
    reload = () => this.forceUpdate();

    interval: NodeJS.Timer|number;

    constructor(props: {}) {
        super(props);

        this.state = {
            users: []
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
                    <h3>Now Active</h3>
                </div>

                <div className={"ActivityPanel_Content"}>
                    { this.state.users.map((user, index) =>
                        <User user={user} key={index} />) }
                </div>
            </div>
        );
    }
}

export default ActivityPanel;
