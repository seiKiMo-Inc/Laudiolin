import React from "react";
import { EventEmitter } from "events";

import Track from "@widget/Track";

import type { TrackData } from "@backend/types";
import emitter from "@backend/events";

interface IProps {
    title: string;
    events: string[];
    collection: () => TrackData[];

    emitter?: EventEmitter;
    queue?: boolean;
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
        const emit = (this.props.emitter ?? emitter);
        for (const event of this.props.events) {
            emit.on(event, this.update);
        }
    }

    componentWillUnmount() {
        const emit = (this.props.emitter ?? emitter);
        for (const event of this.props.events) {
            emit.off(event, this.update);
        }
    }

    render() {
        return (
            <div>
                <h2>{this.props.title}</h2>

                <div style={{ marginTop: 35 }}>
                    {
                        this.props.collection().map((recent, index) =>
                            <Track track={recent} key={index} queue={this.props.queue} />)
                    }
                </div>
            </div>
        );
    }
}

export default TrackList;
