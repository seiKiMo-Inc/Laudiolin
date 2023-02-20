import React from "react";

import { BiHomeAlt, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { FiHeadphones } from "react-icons/fi";

import SearchInput from "@components/search/SearchInput";
import BasicButton from "@components/common/BasicButton";

import { goBack, navigate, goForward } from "@backend/navigation";

import "@css/layout/TopBar.scss";

class TopBar extends React.Component<{}, never> {
    constructor(props: {}) {
        super(props);
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
                    className={"TopBar_ListenAlongButton"}
                    text={"Listen Along"}
                    icon={<FiHeadphones size={17} />}
                />
            </div>
        );
    }
}

export default TopBar;
