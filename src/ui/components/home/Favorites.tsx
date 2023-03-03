import React from "react";

import Favorite from "@widget/Favorite";

import { favorites } from "@backend/user";
import emitter from "@backend/events";

class Favorites extends React.Component<{}, never> {
    update = () => this.forceUpdate();

    componentDidMount() {
        emitter.on("favorites", this.update);
    }

    componentWillUnmount() {
        emitter.off("favorites",  this.update);
    }

    render() {
        return (
            <div>
                <h2 style={{ marginTop: 40 }}>Favorite Tracks</h2>
                <div className={"Home_Favorites"}>
                    {favorites.slice(0, 10).map((favorite, index) => (
                        <Favorite track={favorite} key={index} />
                    ))}
                </div>
            </div>
        );
    }
}

export default Favorites;
