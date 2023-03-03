import React, { ChangeEvent } from "react";

import { BiSearch } from "react-icons/bi";

import { doSearch } from "@backend/search";
import emitter from "@backend/events";
import { router } from "@app/main";
import { contentRoutes } from "@app/constants";

import "@css/layout/TopBar.scss";

interface IProps {}

interface IState {}

class SearchInput extends React.Component<IProps, IState> {
    searchTimeout: NodeJS.Timeout | number = null;

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
                .then(async (results) => {
                    await router.navigate(contentRoutes.SEARCH);
                    emitter.emit("search", results);
                })
                .catch((err) => console.error(err));
            this.searchTimeout = null;
        }, 500);
    }

    onKeyChange(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.key != "Enter") return;

        const text = event.currentTarget.value;
        doSearch(text)
            .then(async (results) => {
                await router.navigate(contentRoutes.SEARCH);
                emitter.emit("search", results);
            })
            .catch((err) => console.error(err));
        this.searchTimeout = null;
    }

    render() {
        return (
            <div className={"SearchInput"}>
                <BiSearch className={"SearchInput_Icon"} size={20} />
                <input
                    className={"SearchInput_Input"}
                    type={"text"}
                    placeholder={"What are you looking for today?"}
                    onChange={(event) => this.onChange(event)}
                    onKeyUp={(event) => this.onKeyChange(event)}
                />
            </div>
        );
    }
}

export default SearchInput;
