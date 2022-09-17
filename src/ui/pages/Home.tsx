import React from "react";
import AnimatePages from "@components/AnimatePages";

class HomePage extends React.Component<any, any> {
    render() {
        return (
            <AnimatePages>
                <div style={{ textAlign: "center", fontSize: 100, color: "white" }}>
                    <h1>Home</h1>
                </div>
            </AnimatePages>
        );
    }
}

export default HomePage;
