import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "@pages/Home";
import SearchResults from "@pages/SearchResults";

import { ContentRoutes } from "@app/constants";

interface IState {
    lightTheme: boolean;
}

class MainView extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            lightTheme: false
        }
    }

    toggleTheme = () => {
        if (!this.state.lightTheme) {
            document.getElementsByTagName("html")[0].setAttribute("data-theme", "light");
            this.setState({ lightTheme: true });
        } else {
            document.getElementsByTagName("html")[0].setAttribute("data-theme", "dark");
            this.setState({ lightTheme: false });
        }
    }

    render() {
        return (
            <div className={"MainView"}>
                <Routes>
                    <Route path={ContentRoutes.home} element={<Home />} />
                    <Route path={ContentRoutes.search} element={<SearchResults />} />
                </Routes>
                <button onClick={this.toggleTheme}>Toggle Theme</button>
            </div>
        );
    }
}

export default MainView;
