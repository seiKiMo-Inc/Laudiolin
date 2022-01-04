import React from "react";

// Import stylesheets.
import "./App.css";

import Button from "react-bootstrap/Button";

interface IProps {

}

interface IState {

}

function clickButton() {
    new Notification("Button", {body: "You clicked on the button!"})
        .onclick = () => alert("You clicked on the notification!");
}

class App extends React.Component<IProps, IState> {
    render() {
        return (
            <div>
                <h1 className="text-3xl font-bold underline">
                    Hello world!
                </h1>

                <br />

                <Button variant="primary" onClick={clickButton}>
                    Really Cool Button!
                </Button>
            </div>
        );
    }
}

export default App;