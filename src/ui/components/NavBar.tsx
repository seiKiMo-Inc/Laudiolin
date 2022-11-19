import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

import { Pages } from "@app/constants";
import { setQuery } from "@backend/search";

import Button from "./common/Button";
import { faMagnifyingGlass, faCog } from "@fortawesome/free-solid-svg-icons";

import Navigator from "@components/common/Navigator";

import "@css/NavBar.scss";

interface IProps {
    navigate: (path: string) => void;
}

interface IState {
    searchQuery: string;
    isGuest: boolean;
    userIcon: string;
    location: string;
}

/* PLACEHOLDER */
async function getUserData(): Promise<any> {
    return { userIcon: "https://i.pinimg.com/736x/d3/b8/e0/d3b8e0bf4f8bf05a915fdd0e36d12591.jpg" }
}

class Navigation extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            searchQuery: "",
            isGuest: true,
            userIcon: "",
            location: window.location.pathname
        };
    }

    inputQuery = (event) => {
        this.setState({ searchQuery: event.target.value });
    };

    searchEnter = (event) => {
        if (event.key != "Enter") return false;

        // Set the search query.
        setQuery(this.state.searchQuery);
        // Redirect to the search page.
        const { navigate } = this.props;
        navigate(Pages.searchResults);

        // Perform a search.
        window.dispatchEvent(new Event("reload"));
    };

    searchButton = () => {
        // Validate the search query.
        const query = this.state.searchQuery;
        if (query.length < 1) return;

        // Set the search query.
        setQuery(query);

        // Perform a search.
        window.dispatchEvent(new Event("reload"));
    };

    toggleDarkMode() {
        const darkMode = !document.documentElement.classList.contains("dark");
        localStorage.setItem("darkMode", darkMode.toString());
        document.documentElement.classList.toggle("dark", darkMode);
    }

    componentDidMount() {
        this.setState({ isGuest: !(localStorage.getItem("isGuest") === "false") });
        getUserData().then((data) => {
            this.setState({ userIcon: data.userIcon || "" });
        });
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (this.state.location !== window.location.pathname) {
            this.setState({
                location: window.location.pathname,
                isGuest: localStorage.getItem("isGuest") == "true"
            });
        }
    }

    render() {

        return (
            <Navbar
                className="navbar"
                variant="dark"
                style={{
                    top: 0,
                    zIndex: 100000000
                }}
            >
                <Container id="NavbarContainer">
                    <Link to={Pages.settings}>
                        <Button icon={faCog} className="SettingsButton" />
                    </Link>
                    <h1 id="Title">Laudiolin</h1>
                    <div id="NavbarLeft">
                        <input
                            id="SearchInput"
                            type="text"
                            name="search"
                            placeholder="Search..."
                            autoComplete="off"
                            autoCorrect="off"
                            onChange={this.inputQuery}
                            onKeyDown={this.searchEnter}
                        />

                        <Link to={Pages.searchResults} onClick={this.searchButton}>
                            <Button id="SearchIcon" icon={faMagnifyingGlass} />
                        </Link>

                        {this.state.isGuest ? (
                            <Link to={Pages.login}>
                                <Button id="NavLoginButton">Log In</Button>
                            </Link>
                        ) : (
                            <Link to={Pages.user}>
                                <img src={this.state.userIcon} id="NavPfp" alt="Profile Picture" />
                            </Link>
                        )}
                    </div>
                </Container>
            </Navbar>
        );
    }
}

export default Navigator(Navigation);
