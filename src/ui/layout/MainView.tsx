import React from "react";

import Navigate from "@components/Navigate";

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
    };

    render() {
        return (
            <div className={"MainView"}>
                <Navigate />

                <button onClick={this.toggleTheme}>Toggle Theme</button>
            </div>
        );
    }
}

export default MainView;
