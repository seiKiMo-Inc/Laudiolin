import React from "react";

import { BiHomeAlt, BiChevronLeft, BiChevronRight, BiGroup } from "react-icons/bi";

import SearchInput from "@components/search/SearchInput";
import BasicButton from "@components/common/BasicButton";

import { goBack, navigate, goForward } from "@backend/navigation";
import { get, save } from "@backend/settings";

import "@css/layout/TopBar.scss";

interface IState {
    isActivityPanelOpen: boolean;
}

class TopBar extends React.Component<{}, IState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            isActivityPanelOpen: get("isActivityPanelOpen", "false") === "true"
        }
    }

    toggleActivityPanel = () => {
        this.setState({ isActivityPanelOpen: !this.state.isActivityPanelOpen });
        const activityPanel = document.getElementsByClassName("ActivityPanel")[0] as HTMLElement;
        activityPanel.style.paddingLeft = this.state.isActivityPanelOpen ? "0" : "24px";
        activityPanel.style.width = this.state.isActivityPanelOpen ? "0" : "320px";
        save("isActivityPanelOpen", `${!this.state.isActivityPanelOpen}`);
    }

    componentDidMount() {
        if (this.state.isActivityPanelOpen) {
            const activityPanel = document.getElementsByClassName("ActivityPanel")[0] as HTMLElement;
            activityPanel.style.paddingLeft = "24px";
            activityPanel.style.width = "320px";
        } else {
            const activityPanel = document.getElementsByClassName("ActivityPanel")[0] as HTMLElement;
            activityPanel.style.paddingLeft = "0";
            activityPanel.style.width = "0";
        }
    }

    render() {
        return (
            <div className={"TopBar"}>
                <div className={"TopBar_Nav"}>
                    <BiChevronLeft className={"TopBar_NavButtons"} size={30} onClick={() => goBack()} />
                    <BiHomeAlt className={"TopBar_NavButtons"} size={20} onClick={() => navigate("Home")} />
                    <BiChevronRight className={"TopBar_NavButtons"} size={30} onClick={() => goForward()} />
                </div>

                <SearchInput />

                <BasicButton
                    className={"TopBar_ActivityButton"}
                    icon={<BiGroup size={22} style={{ color: this.state.isActivityPanelOpen && "var(--accent-color)" }} />}
                    onClick={this.toggleActivityPanel}
                />
            </div>
        );
    }
}

export default TopBar;
