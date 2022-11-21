import React from "react";
import Button from "@components/common/Button";

interface IProps {
    className?: string;
    id: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    buttonText: string;
    buttonIcon?: string;
}

export function toggleDropdown(id: string) {
    document.getElementById(id).classList.toggle("show");
}

class Dropdown extends React.Component<IProps> {
    render() {
        return (
            <>
                <Button onClick={() => toggleDropdown(this.props.id)} className="dropbtn">
                    {this.props.buttonText}
                </Button>
                <div id={this.props.id} className={`dropdown-content ${this.props.className}`} style={this.props.style}>
                    {this.props.children}
                </div>
            </>
        );
    }
}

export default Dropdown;