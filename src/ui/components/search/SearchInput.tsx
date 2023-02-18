import React from "react";

import { BiSearch } from "react-icons/bi";

import "@css/TopBar.scss";

interface IProps {}

interface IState {}

class SearchInput extends React.Component<IProps, IState> {
    render() {
        return (
            <div className={"SearchInput"}>
                <BiSearch className={"SearchInput_Icon"} size={20} />
                <input
                    className={"SearchInput_Input"}
                    type={"text"}
                    placeholder={"What are you looking for today?"}
                />
            </div>
        );
    }
}

export default SearchInput;
