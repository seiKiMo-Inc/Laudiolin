import React from "react";
import { NavLink } from "react-router-dom";

import { RxTimer } from "react-icons/rx";
import { BiDownload, BiHeart, BiWrench } from "react-icons/bi";

import { ContentRoutes } from "@app/constants";

import "@css/NavPanel.scss";

class NavPageList extends React.Component<{}, never> {
    constructor(props: {}) {
        super(props);
    }

    render() {
        return (
            <div className={"NavPanel_PageList"}>
                <NavLink
                    to={ContentRoutes.recents}
                    className={"NavPanel_PageItem"}
                    style={({ isActive }) => ({ color: isActive && "var(--text-primary-color)" })}
                >
                    {({ isActive }) => {
                        return (
                            <>
                                {isActive && <div className={"NavPanel_PageItem_Active"} />}
                                <RxTimer className={"NavPanel_PageItem_Icon"} />
                                <p>Recents</p>
                            </>
                        )
                    }}
                </NavLink>

                <NavLink
                    to={ContentRoutes.favorites}
                    className={"NavPanel_PageItem"}
                    style={({ isActive }) => ({ color: isActive && "var(--text-primary-color)" })}
                >
                    {({ isActive }) => {
                        return (
                            <>
                                {isActive && <div className={"NavPanel_PageItem_Active"} />}
                                <BiHeart className={"NavPanel_PageItem_Icon"} />
                                <p>Favorites</p>
                            </>
                        )
                    }}
                </NavLink>

                <NavLink
                    to={ContentRoutes.downloads}
                    className={"NavPanel_PageItem"}
                    style={({ isActive }) => ({ color: isActive && "var(--text-primary-color)" })}
                >
                    {({ isActive }) => {
                        return (
                            <>
                                {isActive && <div className={"NavPanel_PageItem_Active"} />}
                                <BiDownload className={"NavPanel_PageItem_Icon"} />
                                <p>Downloads</p>
                            </>
                        )
                    }}
                </NavLink>

                <NavLink
                    to={ContentRoutes.settings}
                    className={"NavPanel_PageItem"}
                    style={({ isActive }) => ({ color: isActive && "var(--text-primary-color)" })}
                >
                    {({ isActive }) => {
                        return (
                            <>
                                {isActive && <div className={"NavPanel_PageItem_Active"} />}
                                <BiWrench className={"NavPanel_PageItem_Icon"} />
                                <p>Settings</p>
                            </>
                        )
                    }}
                </NavLink>
            </div>
        );
    }
}

export default NavPageList;
