import React from "react";

interface IProps {
    pageArgs: any;
}

class Playlist extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <p>Playlist</p>
                { this.props.pageArgs && this.props.pageArgs.id }
            </div>
        );
    }
}

export default Playlist;
