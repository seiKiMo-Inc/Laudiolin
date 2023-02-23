import React from "react";

import emitter from "@backend/events";

class Alert extends React.Component<any> {
    private static message: string;
    private static icon: React.ReactNode;

    public static showAlert(message: string, icon?: React.ReactNode) {
        Alert.message = message;
        icon ? Alert.icon = icon : null;

        emitter.emit("alert");

        const alert = document.getElementsByClassName("Alert")[0] as HTMLElement;
        alert.style.display = "block";

        setTimeout(() => alert.style.display = "none", 5000);
    }

    componentDidMount() {
        emitter.on("alert", () => this.forceUpdate());
    }

    componentWillUnmount() {
        emitter.off("alert", () => null);
    }

    render() {
        return (
            <div className={"Alert"}>
                <div className={"AlertContent"}>
                    {Alert.icon ? Alert.icon : null}
                    <p>{Alert.message}</p>
                </div>
            </div>
        );
    }
}

export default Alert;
