import React from "react";

import Favorite from "@widget/Favorite";

import { TrackData } from "@app/types";

interface IProps {
    favorites: TrackData[];
}

class Favorites extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <h2 style={{ marginTop: 40 }}>Favorite Tracks</h2>
                <div className={"Home_Favorites"}>
                    {this.props.favorites.slice(0, 10).map((favorite, index) => (
                        <Favorite track={favorite} key={index} />
                    ))}
                </div>
            </div>
        );
    }
}

export default Favorites;
