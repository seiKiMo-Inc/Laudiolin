import React, { ChangeEvent } from "react";

import { BiSearch } from "react-icons/bi";

import { doSearch } from "@backend/search";
import { navigate } from "@backend/navigation";

import "@css/layout/TopBar.scss";

interface IProps {}

interface IState {}

class SearchInput extends React.Component<IProps, IState> {
    searchTimeout: NodeJS.Timeout|number = null;

    constructor(props: IProps) {
        super(props);
    }

    onChange(event: ChangeEvent<HTMLInputElement>): void {
        const text = event.target.value;
        if (text.length <= 0) return;

        // Clear the timeout if it exists.
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        this.searchTimeout = setTimeout(() => {
            doSearch(text)
                .then(results => navigate("Search", { results }))
                .catch(err => console.error(err));
            this.searchTimeout = null;
        }, 500);
    }

    render() {
        return (
            <div className={"SearchInput"}>
                <BiSearch className={"SearchInput_Icon"} size={20} />
                <input
                    className={"SearchInput_Input"}
                    type={"text"}
                    placeholder={"What are you looking for today?"}
                    onChange={event => this.onChange(event)}
                />
            </div>
        );
    }
}

export default SearchInput;
