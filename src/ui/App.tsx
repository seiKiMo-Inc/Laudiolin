import React from "react";

import "./App.css";

interface IProps {

}

interface IState {

}

class App extends React.Component<IProps, IState> {
    render() {
        return (
            <div>
                <h1 className="text-3xl font-bold underline">
                    Hello world!
                </h1>
            </div>
        );
    }
}

export default App;