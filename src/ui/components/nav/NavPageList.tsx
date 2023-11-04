import React from "react";
import { NavLink } from "react-router-dom";

import { RxTimer } from "react-icons/rx";
import { FaRobot } from "react-icons/fa";
import { BiDownload, BiHeart, BiWrench } from "react-icons/bi";

import { contentRoutes } from "@app/constants";

import { User } from "@app/types";

import "@css/layout/NavPanel.scss";

interface IProps {
    user: User;
}

interface IState {
    elixir: boolean;
}

class NavPageList extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            elixir: false
        };
    }

    render() {
        return (
            <div className={"NavPanel_PageList"}>
                <NavLink
                    to={contentRoutes.RECENTS}
                    className={"NavPanel_PageItem"}
                    style={({ isActive }) => ({
                        color: isActive && "var(--text-primary-color)"
                    })}
                >
                    {({ isActive }) => {
                        return (
                            <>
                                {isActive && (
                                    <div
                                        className={"NavPanel_PageItem_Active"}
                                    />
                                )}
                                <RxTimer
                                    style={{ color: isActive && "var(--text-primary-color)" }}
                                    className={"NavPanel_PageItem_Icon"}
                                />
                                <p style={{ color: isActive && "var(--text-primary-color)" }}>
                                    Recents
                                </p>
                            </>
                        );
                    }}
                </NavLink>

                <NavLink
                    to={contentRoutes.FAVORITES}
                    className={"NavPanel_PageItem"}
                    style={({ isActive }) => ({
                        color: isActive && "var(--text-primary-color)"
                    })}
                >
                    {({ isActive }) => {
                        return (
                            <>
                                {isActive && (
                                    <div
                                        className={"NavPanel_PageItem_Active"}
                                    />
                                )}
                                <BiHeart
                                    style={{ color: isActive && "var(--text-primary-color)" }}
                                    className={"NavPanel_PageItem_Icon"}
                                />
                                <p style={{ color: isActive && "var(--text-primary-color)" }}>
                                    Favorites
                                </p>
                            </>
                        );
                    }}
                </NavLink>

// #v-ifdef VITE_BUILD_ENV='desktop'
                <NavLink
                    to={contentRoutes.DOWNLOADS}
                    className={"NavPanel_PageItem"}
                    style={({ isActive }) => ({
                        color: isActive && "var(--text-primary-color)"
                    })}
                >
                    {({ isActive }) => {
                        return (
                            <>
                                {isActive && (
                                    <div
                                        className={"NavPanel_PageItem_Active"}
                                    />
                                )}
                                <BiDownload
                                    style={{ color: isActive && "var(--text-primary-color)" }}
                                    className={"NavPanel_PageItem_Icon"}
                                />
                                <p style={{ color: isActive && "var(--text-primary-color)" }}>
                                    Downloads
                                </p>
                            </>
                        );
                    }}
                </NavLink>
// #v-endif

                {
                    this.props.user?.connections?.discord && (
                        <NavLink
                            to={contentRoutes.ELIXIR}
                            className={"NavPanel_PageItem"}
                            style={({ isActive }) => ({
                                color: isActive && "var(--text-primary-color)"
                            })}
                        >
                            {({ isActive }) => {
                                return (
                                    <>
                                        {isActive && (
                                            <div
                                                className={"NavPanel_PageItem_Active"}
                                            />
                                        )}
                                        <FaRobot
                                            style={{ color: isActive && "var(--text-primary-color)" }}
                                            className={"NavPanel_PageItem_Icon"}
                                        />
                                        <p style={{ color: isActive && "var(--text-primary-color)" }}>
                                            Elixir
                                        </p>
                                    </>
                                );
                            }}
                        </NavLink>
                    )
                }

                <NavLink
                    to={contentRoutes.SETTINGS}
                    className={"NavPanel_PageItem"}
                    style={({ isActive }) => ({
                        color: isActive && "var(--text-primary-color)"
                    })}
                >
                    {({ isActive }) => {
                        return (
                            <>
                                {isActive && (
                                    <div
                                        className={"NavPanel_PageItem_Active"}
                                    />
                                )}
                                <BiWrench
                                    style={{ color: isActive && "var(--text-primary-color)" }}
                                    className={"NavPanel_PageItem_Icon"}
                                />
                                <p style={{ color: isActive && "var(--text-primary-color)" }}>
                                    Settings
                                </p>
                            </>
                        );
                    }}
                </NavLink>
            </div>
        );
    }
}

export default NavPageList;
