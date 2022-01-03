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

import {playTrack} from "../backend/music";
function playMusic() {
    playTrack("https://app.magix.lol/download?id=c6rCRy6SrtU&source=YouTube");
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

                <br />

                <Button variant="primary" onClick={playMusic}>
                    Play Music
                </Button>
            </div>
        );
    }
}

export default App;