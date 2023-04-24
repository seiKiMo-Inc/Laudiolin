import React, { ChangeEvent } from "react";

import { BiSearch } from "react-icons/bi";
import { BsFileMusicFill } from "react-icons/bs";
import { FaSpotify, FaYoutube } from "react-icons/fa";

import { doSearch } from "@backend/search";
import emitter from "@backend/events";
import { getFromPath, saveFromPath } from "@backend/settings";

import { contentRoutes } from "@app/constants";
import { router } from "@app/main";

import { SearchEngine } from "@app/backend/types";

import "@css/layout/TopBar.scss";


interface IProps {}

interface IState {
    searchType: SearchEngine;
}

class SearchInput extends React.Component<IProps, IState> {
    searchTimeout: NodeJS.Timeout | number = null;

    constructor(props: IProps) {
        super(props);

        this.state = {
            searchType: getFromPath("search.engine", "") as SearchEngine
        };
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

    onSearchTypeChange(type: SearchEngine): void {
        this.setState({ searchType: type });
        saveFromPath("search.engine", type);
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
                <select 
                    className={"SearchInput_SearchType"} 
                    onChange={(event) => this.onSearchTypeChange(event.target.value as SearchEngine)}
                    value={this.state.searchType}
                >
                    <option value={"All"}>
                        <BsFileMusicFill /> All
                    </option>

                    <option value={"YouTube"}>
                        <FaYoutube /> YouTube
                    </option>

                    <option value={"Spotify"}>
                        <FaSpotify /> Spotify
                    </option>
                </select>
            </div>
        );
    }
}

export default SearchInput;
