import React from "react";
import "./App.css";

import { Container, Button } from "react-bootstrap";

import Navigation from "components/NavBar";
import Controls from "components/Controls";

interface IProps {

}

interface IState {

}

function clickButton() {
    new Notification("Button", { body: "You clicked on the button!" }).onclick = () =>
        alert("You clicked on the notification!");
}

class App extends React.Component<IProps, IState> {
    render() {
        return (
            <>
                <Navigation />

                <Container style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                    <h1 className="text-3xl">Hello world!</h1>

                    <br />

                    <Button variant="primary" onClick={clickButton}>
                        Really Cool Button!
                    </Button>
                </Container>

                <Controls />
            </>
        );
    }
}

export default App;
