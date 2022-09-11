import { faMoon } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { FormControl } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "./Button";

interface IProps { }
interface IState {
    lastScrollY: any;
    showNav: any;
}
class Navigation extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            lastScrollY: 0,
            showNav: true,
        };
    }

    handleScroll = () => {
        const { lastScrollY } = this.state;
        const currentScrollY = window.scrollY;
        this.setState({ showNav: currentScrollY < lastScrollY });
        this.setState({ lastScrollY: currentScrollY });
    };

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }


    toggleDarkMode() {
        const darkmode = !document.documentElement.classList.contains("dark");
        localStorage.setItem("darkMode", darkmode.toString());
        document.documentElement.classList.toggle("dark", darkmode);
    }

    render() {
        const { showNav } = this.state;
        return (
            <Navbar
                className="navbar"
                variant="dark"
                style={{
                    top: showNav ? 0 : -100,
                    zIndex: 100,
                }}

            >

                <Container>
                    <h1 className="titleLogo">Laudiolin</h1>

                </Container>
            </Navbar>
        );
    }
}

export default Navigation;