import React from "react";

import Track from "@components/Track";

import "@css/pages/SearchResults.scss";

const result = {
    "title": "hikarunara",
    "artist": "Goose House",
    "icon": "http://192.168.1.2:3000/proxy/LfH3rPgnSPUEU7M7zEN4o4G8Db21Q8r66HxNAZYOjzo1iJtEZnNmFzgivsR9mVTE3GcXoc4-8dI1KC-d=w544-h544-l90-rj?from=cart",
    "url": "https://youtu.be/IeJTNN8_jLI",
    "id": "IeJTNN8_jLI",
    "duration": 255
};

class SearchResults extends React.Component {
    render() {
        return (
            <div className={"SearchResults"}>
                <h1>SearchResults</h1>
                <br />
                <Track track={result} />
            </div>
        );
    }
}

export default SearchResults;
