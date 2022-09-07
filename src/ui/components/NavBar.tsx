import React from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

interface IProps {}
interface IState {
    lastScrollY;
    showNav;
}
class Navigation extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            lastScrollY: 0,
            showNav: true,
        };
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll = () => {
        const { lastScrollY } = this.state;
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
            this.setState({ showNav: false });
        } else {
            this.setState({ showNav: true });
        }

        this.setState({ lastScrollY: currentScrollY });
    };

    render() {
        const { showNav } = this.state;
        return (
            <Navbar
                bg="dark"
                variant="dark"
                style={{
                    position: "fixed",
                    width: "100%",
                    top: showNav ? 0 : -100,
                    transition: "top 0.5s",
                    zIndex: 100,
                }}
            >
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
