import React from "react";

import { BiChevronDown } from "react-icons/bi";

import BasicButton from "@components/common/BasicButton";
import BasicDropdown from "@components/common/BasicDropdown";
import { toggleDropdown } from "@components/common/BasicDropdown";

import { BasicUser } from "@backend/types";

import "@css/NavPanel.scss";

const placeholderUser: BasicUser = {
    userId: "1",
    avatar: "https://cdn.discordapp.com/avatars/593787701409611776/9582cd249fff25619d95454eae25cd55.png",
    username: "Scald",
    discriminator: "7763",
}

interface IProps {
    isLoggedIn: boolean;
}

class CurrentUser extends React.Component<IProps, never> {
    render() {
        return this.props.isLoggedIn ? (
            <>
                <div className={"CurrentUser"}>
                    <div className={"CurrentUser_Info"}>
                        <img src={placeholderUser.avatar} className={"CurrentUser_Img"} alt={placeholderUser.username} />
                        <span className={"CurrentUser_Text"}>
                            <p>{placeholderUser.username}</p>
                            <p>#{placeholderUser.discriminator}</p>
                        </span>
                    </div>

                    <BasicButton
                        onClick={() => toggleDropdown("currentUserDropdown")}
                        icon={<BiChevronDown className={"CurrentUser_Chevron"} />}
                        className={"CurrentUser_DropdownButton"}
                    />
                </div>

                <BasicDropdown id={"currentUserDropdown"}>
                    <a href="#">Profile</a>
                    <a href="#">Logout</a>
                </BasicDropdown>
            </>
        ) : (
            <BasicButton className={"CurrentUser_LoginBtn"} text={"Login"} />
        );
    }
}

export default CurrentUser;
