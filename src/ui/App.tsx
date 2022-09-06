import React from "react";
import "./App.css";

import { Container, Button } from "react-bootstrap";

import Navigation from "components/NavBar";
import Controls from "components/Controls";

interface IProps {}
interface IState {
    showControls: boolean;
}
class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            showControls: true,
        };
    }

    render() {
        return (
            <>
                <Navigation />

                <Container style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                    <h1 className="text-3xl">Hello world!</h1>

                    <br />

                    <Button variant="primary" onClick={() => this.setState({ showControls: !this.state.showControls })}>
                        Toggle Controls
                    </Button>
                </Container>

                {this.state.showControls && <Controls />}
            </>
        );
    }
}

export default App;
