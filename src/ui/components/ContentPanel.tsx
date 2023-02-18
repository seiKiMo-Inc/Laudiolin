import React from "react";

interface IState {
    lightTheme: boolean;
}

class ContentPanel extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            lightTheme: false
        }
    }

    toggleTheme = () => {
        if (!this.state.lightTheme) {
            document.getElementsByTagName("html")[0].setAttribute("data-theme", "light");
            this.setState({ lightTheme: true });
        } else {
            document.getElementsByTagName("html")[0].setAttribute("data-theme", "dark");
            this.setState({ lightTheme: false });
        }
    }

    render() {
        return (
            <div className={"ContentPanel"}>
                <h1>ContentPanel</h1>
                <button onClick={this.toggleTheme}>Toggle Theme</button>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                    Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquet nisl, <br />
                    eget aliquam nunc nisl eget nunc. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                    Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquet nisl, <br />
                    eget aliquam nunc nisl eget nunc. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                    Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquet nisl, <br />
                    eget aliquam nunc nisl eget nunc. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                    Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquet nisl, <br />
                    eget aliquam nunc nisl eget nunc. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                    Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquet nisl, <br />
                    eget aliquam nunc nisl eget nunc. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                    Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquet nisl, <br />
                    eget aliquam nunc nisl eget nunc. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                    Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquet nisl, <br />
                    eget aliquam nunc nisl eget nunc. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                    Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquet nisl, <br />
                    eget aliquam nunc nisl eget nunc. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                    Nulla facilisi. <br />
                </p>
            </div>
        );
    }
}

export default ContentPanel;
