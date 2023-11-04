import React from "react";

import BasicButton from "@components/common/BasicButton";

interface IProps {
    children: React.ReactNode;
    className?: string;
    id: string;
    style?: React.CSSProperties;
    onSubmit?: () => any | void;
    hasResult?: boolean;
    buttonText?: string;
}

class BasicModal extends React.Component<IProps> {
    constructor(props: any) {
        super(props);
    }

    private hideModal = (e: any) => {
        if (e.target.className !== "BasicModal_Backdrop" || e.target.id === "login") return;
        const modal = document.getElementById(this.props.id) as HTMLElement;
        modal.style.display = "none";
    };

    private onSubmit = () => {
        const modal = document.getElementById(this.props.id) as HTMLElement;

        if (this.props.hasResult) {
            const result = this.props.onSubmit?.();
            result && modal.onsubmit(result);
        } else
            this.props.onSubmit?.();
        this.hideModal({ target: { className: "BasicModal_Backdrop" } });
    };

    public static showModal(id: string, callback?: (any: any) => void) {
        const modal = document.getElementById(id) as HTMLElement;
        modal.style.display = "block";
        modal.onsubmit = callback;
    }

    public static hideModal(id: string) {
        const modal = document.getElementById(id) as HTMLElement;
        modal.style.display = "none";
    }

    render() {
        return (
            <div
                className={"BasicModal_Backdrop"}
                id={this.props.id}
                onClick={this.hideModal.bind(this)}
            >
                <div
                    className={`BasicModal ${this.props.className}`}
                    style={this.props.style}
                >
                    {this.props.children}
                    {this.props.onSubmit && (
                        <BasicButton
                            className={"BasicModal_Submit"}
                            text={this.props.buttonText ?? "Submit"}
                            onClick={this.onSubmit}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default BasicModal;
