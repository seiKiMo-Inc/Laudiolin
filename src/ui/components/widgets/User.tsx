import React from "react";

import { FiHeadphones } from "react-icons/all";

import BasicButton from "@components/common/BasicButton";

import type { OnlineUser } from "@backend/types";
import { listeningWith, listenWith } from "@backend/social";

import "@css/components/User.scss";
import { userData } from "@backend/user";

interface IProps {
    user: OnlineUser;
}

class User extends React.PureComponent<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { user } = this.props;
        if (user.userId == userData.userId) return undefined;
        const listening = user.listeningTo;
        if (listening == null) return undefined;

        return (
            <div className={"User"}>
                <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                    <img
                        className={"User_Image"}
                        src={user.avatar}
                        alt={user.username}
                    />

                    <div className={"User_Info"}>
                        <div className={"User_Name"}>
                            {user.username}
                            #{user.discriminator}
                        </div>
                        <p style={{ maxLines: 1 }}>{listening.title}</p>
                        <p style={{ maxLines: 1 }}>{listening.artist}</p>
                    </div>
                </div>

                <BasicButton
                    className={"User_Listen"}
                    icon={<FiHeadphones />}
                    onClick={() => listeningWith != user.userId && listenWith(user.userId)}
                    style={{
                        backgroundColor: listeningWith == user.userId ?
                            "var(--accent-color)" : "var(--secondary-background-color)"
                    }}
                />
            </div>
        );
    }
}

export default User;
