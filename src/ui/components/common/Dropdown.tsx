import React from "react";
import Button from "@components/common/Button";

interface IProps {
    className?: string;
    id: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    useButton: boolean;
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
                {this.props.useButton ? (
                        <Button onClick={() => toggleDropdown(this.props.id)} className="dropbtn">
                            {this.props.buttonText}
                        </Button>
                    ) : null}
                <div id={this.props.id} className={`dropdown-content ${this.props.className}`} style={this.props.style}>
                    {this.props.children}
                </div>
            </>
        );
    }
}

export default Dropdown;