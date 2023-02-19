import React from "react";

import { BiHomeAlt, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { FiHeadphones } from "react-icons/fi";

import SearchInput from "@components/search/SearchInput";
import BasicButton from "@components/common/BasicButton";

import { navigate } from "@backend/navigation";

import "@css/layout/TopBar.scss";

class TopBar extends React.Component<{}, never> {
    constructor(props: {}) {
        super(props);
    }

    goBack() {
        window.history.back();
    }

    goToHome() {
        navigate("Home");
    }

    goForward() {
        window.history.forward();
    }

    render() {
        return (
            <div className={"TopBar"}>
                <div className={"TopBar_Nav"}>
                    <BiChevronLeft className={"TopBar_NavButtons"} size={30} onClick={this.goBack} />
                    <BiHomeAlt className={"TopBar_NavButtons"} size={20} onClick={this.goToHome} />
                    <BiChevronRight className={"TopBar_NavButtons"} size={30} onClick={this.goForward} />
                </div>

                <SearchInput />

                <BasicButton
                    className={"TopBar_ListenAlongButton"}
                    text={"Listen Along"}
                    icon={<FiHeadphones size={17} />}
                />
            </div>
        );
    }
}

export default TopBar;
