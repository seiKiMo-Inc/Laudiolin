import React from "react";

import {
    BiHomeAlt,
    BiChevronLeft,
    BiChevronRight,
    BiGroup
} from "react-icons/bi";
import { Tooltip } from "react-tooltip";

import SearchInput from "@components/search/SearchInput";
import BasicButton from "@components/common/BasicButton";

import emitter from "@backend/events";
import { router } from "@app/main";
import { contentRoutes } from "@app/constants";
import WithStore, { GlobalState, useGlobal } from "@backend/stores";

import "@css/layout/TopBar.scss";

interface IProps {
    pStore: GlobalState;
}

class TopBar extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    toggleActivityPanel = () => {
        const currentState = this.props.pStore.activityOpen;
        this.props.pStore.setActivityOpen(!currentState);

        const activityPanel = document.getElementsByClassName(
            "ActivityPanel"
        )[0] as HTMLElement;
        activityPanel.style.paddingLeft = currentState
            ? "0"
            : "24px";
        activityPanel.style.width = currentState
            ? "0"
            : "320px";
    };

    componentDidMount() {
        if (this.props.pStore.activityOpen) {
            const activityPanel = document.getElementsByClassName(
                "ActivityPanel"
            )[0] as HTMLElement;
            activityPanel.style.paddingLeft = "24px";
            activityPanel.style.width = "320px";
        } else {
            const activityPanel = document.getElementsByClassName(
                "ActivityPanel"
            )[0] as HTMLElement;
            activityPanel.style.paddingLeft = "0";
            activityPanel.style.width = "0";
        }
    }

    render() {
        return (
            <div className={"TopBar"}>
                <div className={"TopBar_Nav"}>
                    <BiChevronLeft
                        className={"TopBar_NavButtons"}
                        size={30}
                        onClick={() => window.history.back()}
                        data-tooltip-content={"Go back"}
                    />
                    <BiHomeAlt
                        className={"TopBar_NavButtons"}
                        size={20}
                        onClick={() => router.navigate(contentRoutes.HOME)}
                        data-tooltip-content={"Home"}
                    />
                    <BiChevronRight
                        className={"TopBar_NavButtons"}
                        size={30}
                        onClick={() => window.history.forward()}
                        data-tooltip-content={"Go forward"}
                    />
                </div>

                <SearchInput />

                <BasicButton
                    className={"TopBar_ActivityButton"}
                    icon={
                        <BiGroup
                            size={22}
                            style={{
                                color:
                                    this.props.pStore.activityOpen &&
                                    "var(--accent-color)"
                            }}
                        />
                    }
                    onHover={() => emitter.emit("activity:update")}
                    onClick={this.toggleActivityPanel}
                    tooltipId={"activity_tooltip"}
                />

                <Tooltip anchorSelect={".TopBar_NavButtons"} place={"bottom"} className={"Tooltip"} />
                <Tooltip id={"activity_tooltip"} place={"bottom"} className={"Tooltip"}>Toggle Activity Tab</Tooltip>
            </div>
        );
    }
}

export default WithStore(TopBar, useGlobal);
