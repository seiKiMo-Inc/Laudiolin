import React from "react";
import "./App.css";
import Container from 'react-bootstrap/Container';
import Controls from "./components/controls";
import Navigation from "./components/navbar";
import Button from "react-bootstrap/Button";
interface IProps {}
interface IState {}
function clickButton() {
    new Notification("Button", { body: "You clicked on the button!" }).onclick = () =>
        alert("You clicked on the notification!");
}
class App extends React.Component<IProps, IState> {
    render() {
        return (
            <div>
                <Navigation />
                <Container>
                    <h1 className="text-3xl font-bold underline">Hello world!</h1>

                    <br />

                    <Button variant="primary" onClick={clickButton}>
                        Really Cool Button!
                    </Button>

                    <br />
                    <Controls></Controls>
                </Container>
            </div>
        );
    }
}

export default App;
