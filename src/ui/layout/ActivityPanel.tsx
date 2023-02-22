import React from "react";

import "@css/layout/ActivityPanel.scss";

class ActivityPanel extends React.Component<{}, never> {
    constructor(props: {}) {
        super(props);
    }

    render() {
        return (
            <div className={"ActivityPanel"}>
                <h1>Activity</h1>
            </div>
        );
    }
}

export default ActivityPanel;
