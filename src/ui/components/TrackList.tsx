import React from "react";

import Track from "@widget/Track";

import type { TrackData } from "@backend/types";
import emitter from "@backend/events";

interface IProps {
    title: string;
    events: string[];
    collection: () => TrackData[];
}

class TrackList extends React.Component<IProps, never> {
    /**
     * Update handler.
     */
    update = () => this.forceUpdate();

    constructor(props: IProps) {
        super(props);
    }

    componentDidMount() {
        for (const event of this.props.events) {
            emitter.on(event, this.update);
        }
    }

    componentWillUnmount() {
        for (const event of this.props.events) {
            emitter.off(event, this.update);
        }
    }

    render() {
        return (
            <div>
                <h2>{this.props.title}</h2>

                <div style={{ marginTop: 35 }}>
                    {
                        this.props.collection().map((recent, index) =>
                            <Track track={recent} key={index} />)
                    }
                </div>
            </div>
        );
    }
}

export default TrackList;
