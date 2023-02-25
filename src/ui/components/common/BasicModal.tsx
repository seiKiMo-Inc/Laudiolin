import React from "react";

import BasicButton from "@components/common/BasicButton";

interface IProps {
    children: React.ReactNode;
    className?: string;
    id: string;
    style?: React.CSSProperties;
    onSubmit?: () => void;
    buttonText?: string;
}

class BasicModal extends React.Component<IProps> {
    constructor(props: any) {
        super(props);
    }

    private hideModal = (e) => {
        if (e.target.className !== "BasicModal_Backdrop") return;
        const modal = document.getElementById(this.props.id) as HTMLElement;
        modal.style.display = "none";
    };

    private onSubmit = () => {
        this.props.onSubmit();
        this.hideModal({ target: { className: "BasicModal_Backdrop" } });
    };

    public static showModal(id: string) {
        const modal = document.getElementById(id) as HTMLElement;
        modal.style.display = "block";
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
                onClick={(e) => this.hideModal(e)}
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
