import React from "react";

import AnimatedView from "@components/common/AnimatedView";
import TrackList from "@components/TrackList";

import WithStore, { useDownloads } from "@backend/stores";
import { TrackData } from "@app/types";

interface IProps {
    pStore: { [key: number]: TrackData };
}

class Downloads extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const downloads = Object.values(this.props.pStore);

        return downloads.length > 0 ? (
            <AnimatedView>
                <TrackList
                    title={"Downloads"}
                    events={["login", "downloads"]}
                    collection={() => downloads}
                />
            </AnimatedView>
        ) : (
            <AnimatedView className={"empty"}>
                <h1>No Downloads</h1>
                <p>Downloaded tracks will appear here.</p>
            </AnimatedView>
        );
    }
}

export default WithStore(Downloads, useDownloads);
