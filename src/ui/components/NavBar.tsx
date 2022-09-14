import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

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
                <Container id="NavbarContainer">
                    <h1 id="Title">Laudiolin</h1>
                    <div id="Search">
                        <input id="SearchInput" type="text"
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

export default Navigation;