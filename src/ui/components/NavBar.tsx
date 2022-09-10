import { faMoon } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Col, Form, FormControl, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "./Button";

interface IProps { }
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
    toggleDarkMode() {
        const darkmode = !document.documentElement.classList.contains("dark");
        localStorage.setItem("darkMode", darkmode.toString());
        document.documentElement.classList.toggle("dark", darkmode);
    }
    render() {
        const { showNav } = this.state;
        return (
            <Navbar
                variant="dark"
                style={{
                    top: showNav ? 0 : -100,
                    zIndex: 100
                }}
                className={"navbar"}
            >
                <Button icon={faMoon} onClick={() => this.toggleDarkMode()} className={"ml-4 py-2 px-3 bg-slate-500 dark:bg-slate-200 transition-all rounded-full"} />
                <Container style={{ margin: 0, marginLeft: "40px" }}>
                    <Navbar.Brand>Laudiolin</Navbar.Brand>
                </Container>
                <Navbar.Collapse>
                    <Form>
                        <Row>
                            <Col>

                                <FormControl
                                    type="text"
                                    placeholder="query"
                                    className="mr-sm-2 w-full"
                                />
                            </Col>
                            <Col>
                                <Button className={"py-2 px-4 bg-blue-500 border-b-0 rounded-lg text-white dark:bg-indigo-600"}>Search</Button>
                            </Col>
                        </Row>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Navigation;
