import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "@pages/Home";
import SearchResults from "@pages/SearchResults";

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
                <h1>ContentPanel</h1>
                <button onClick={this.toggleTheme}>Toggle Theme</button>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<SearchResults />} />
                </Routes>
            </div>
        );
    }
}

export default MainView;
