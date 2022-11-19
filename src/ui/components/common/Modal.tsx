import React from "react";
import Button from "@components/common/Button";

interface IProps {
    className?: string;
    id: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    onSubmit: () => void;
}

export const displayModal = (id: string) => {
    const modal = document.getElementById(id);
    modal.style.display = "block";
}

class Modal extends React.Component<IProps> {
    hideModal = (id: string) => {
        const modal = document.getElementById(id);
        modal.style.display = "none";
    }

    render() {
        return (
            <div className={`Modal ${this.props.className}`} id={this.props.id} style={this.props.style}>
                <div className={`ModalBody ${this.props.className}`} id={this.props.id} style={this.props.style}>
                    <span className="CloseModal" onClick={() => this.hideModal(this.props.id)}>&times;</span>
                    {this.props.children}
                    <Button className="ModalSubmit" onClick={this.props.onSubmit}>Submit</Button>
                </div>
            </div>
        );
    }
}

export default Modal;