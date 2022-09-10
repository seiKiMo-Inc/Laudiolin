import { faMoon } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { FormControl } from "react-bootstrap";
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
                    <div className={"inline-flex rounded-md shadow-sm"}>

                        <FormControl
                            type="text"
                            placeholder="query"
                            className="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-transparent rounded-l-lg border border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                        />
                        <Button className={"inline-flex items-center py-2 px-4 text-sm font-medium bg-transparent rounded-l-lg  text-white dark:border-indigo-600 dark:hover:bg-gray-700 dark:focus:bg-gray-700"}>Search</Button>
                    </div>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Navigation;
