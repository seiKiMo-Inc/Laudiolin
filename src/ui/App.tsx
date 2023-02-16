import React from "react";

interface IProps {

}

interface IState {

}

class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div>
                <a>Hello world!</a>
            </div>
        );
    }
}

export default App;