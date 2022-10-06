import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

import { Pages } from "@app/constants";
import { setQuery } from "@backend/search";

import Button from "./Button";
import { faMagnifyingGlass, faCog } from "@fortawesome/free-solid-svg-icons";

import Navigator from "@components/Navigator";

import "@css/NavBar.scss";

interface IProps {
    navigate: (path: string) => void;
}
interface IState {
    lastScrollY: any;
    showNav: any;
    searchQuery: string;
}

class Navigation extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            lastScrollY: 0,
            showNav: true,
            searchQuery: ""
        };
    }

    handleScroll = () => {
        const { lastScrollY } = this.state;
        const currentScrollY = window.scrollY;
        this.setState({ showNav: currentScrollY < lastScrollY });
        this.setState({ lastScrollY: currentScrollY });
    };

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

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    toggleDarkMode() {
        const darkMode = !document.documentElement.classList.contains("dark");
        localStorage.setItem("darkMode", darkMode.toString());
        document.documentElement.classList.toggle("dark", darkMode);
    }

    render() {
        const { showNav } = this.state;

        return (
            <Navbar
                className="navbar"
                variant="dark"
                style={{
                    top: showNav ? 0 : -100,
                    zIndex: 100
                }}
            >
                <Container id="NavbarContainer">
                    <Link to={Pages.settings}>
                        <Button icon={faCog} className="SettingsButton" />
                    </Link>
                    <h1 id="Title">Laudiolin</h1>
                    <div id="Search">
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
                    </div>
                </Container>
            </Navbar>
        );
    }
}

export default Navigator(Navigation);
