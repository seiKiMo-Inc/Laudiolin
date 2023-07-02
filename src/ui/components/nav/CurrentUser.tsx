import React from "react";

import { BiChevronDown } from "react-icons/bi";

import BasicButton from "@components/common/BasicButton";
import BasicDropdown from "@components/common/BasicDropdown";
import { toggleDropdown } from "@components/common/BasicDropdown";

import type { User } from "@backend/types";
import { logout } from "@backend/user";
import { router } from "@app/main";
import { contentRoutes } from "@app/constants";

import "@css/layout/NavPanel.scss";

interface IProps {
    user?: User;
}

class CurrentUser extends React.Component<IProps, never> {
    onDropdownClick() {
        toggleDropdown("currentUserDropdown");

        const dropBtn = document.getElementsByClassName(
            "CurrentUser_Chevron"
        )[0] as HTMLElement;
        dropBtn.style.transform =
            dropBtn.style.transform === "rotate(180deg)"
                ? "rotate(0deg)"
                : "rotate(180deg)";
    }

    /**
     * Logs the user out of the application.
     */
    logOut(): void {
        logout();
    }

    render() {
        const { user } = this.props;

        return user != null ? (
            <>
                <div className={"CurrentUser"}>
                    <div className={"CurrentUser_Info"}>
                        <img
                            src={user.avatar}
                            className={"CurrentUser_Img"}
                            alt={user.username}
                        />
                        <span className={"CurrentUser_Text"}>
                            <p>{user.username}</p>
                            {user.discriminator != "0" && <p>#{user.discriminator}</p>}
                        </span>
                    </div>

                    <BasicButton
                        onClick={this.onDropdownClick}
                        icon={
                            <BiChevronDown className={"CurrentUser_Chevron"} />
                        }
                        className={"CurrentUser_DropdownButton dropbtn"}
                    />
                </div>

                <BasicDropdown id={"currentUserDropdown"}>
                    <a onClick={() => this.logOut()}>Log Out</a>
                </BasicDropdown>
            </>
        ) : (
            <BasicButton
                className={"CurrentUser_LoginBtn"}
                text={"Login"}
                onClick={() => router.navigate(contentRoutes.LOGIN)}
            />
        );
    }
}

export default CurrentUser;
