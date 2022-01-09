import React from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

class Navigation extends React.Component<any, any> {
    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Container style={{ margin: 0, marginLeft: "40px" }}>
                    <Navbar.Brand>Laudiolin</Navbar.Brand>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Explore</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}

export default Navigation;
