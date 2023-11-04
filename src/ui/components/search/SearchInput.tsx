import React, { ChangeEvent } from "react";

import { BiSearch } from "react-icons/bi";

import { doSearch } from "@backend/core/search";

import { contentRoutes } from "@app/constants";
import { router } from "@app/main";

import { SearchEngine } from "@app/types";
import WithStore, { Settings, GlobalState, useGlobal, useSettings } from "@backend/stores";

import "@css/layout/TopBar.scss";

interface IProps {
    pStore: GlobalState;
    sStore: Settings;
}

class SearchInput extends React.Component<IProps, never> {
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
            this.props.pStore.setSearchResults({ waiting: true }, text);

            doSearch(text)
                .then(async (results) => {
                    await router.navigate(contentRoutes.SEARCH);
                    this.props.pStore.setSearchResults(results);
                })
                .catch((err) => console.error(err));
            this.searchTimeout = null;
        }, 500);
    }

    onKeyChange(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.key != "Enter") return;

        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = null;
        }

        const text = event.currentTarget.value;
        this.props.pStore.setSearchResults({ waiting: true }, text);
        doSearch(text)
            .then(async (results) => {
                await router.navigate(contentRoutes.SEARCH);
                this.props.pStore.setSearchResults(results);
            })
            .catch((err) => console.error(err));
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
                    onChange={(event) => this.props.sStore.setSearchEngine(event.target.value as SearchEngine)}
                    value={this.props.sStore.search.engine}
                >
                    <option value={"All"}>
                        All
                    </option>

                    <option value={"YouTube"}>
                        YouTube
                    </option>

                    <option value={"Spotify"}>
                        Spotify
                    </option>
                </select>
            </div>
        );
    }
}

export default WithStore(SearchInput, useGlobal, useSettings);
