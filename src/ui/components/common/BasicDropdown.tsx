import React from "react";

import BasicButton from "@components/common/BasicButton";

interface IProps {
    className?: string;
    id: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    useButton?: boolean;
    buttonText?: string;
    buttonIcon?: string;
}

export function toggleDropdown(id: string, x?: number, y?: number) {
    const element = document.getElementById(id);
    element.classList.toggle("show");
    if (x && y) {
        element.style.left = x + "px";
        element.style.top = y + "px";
    }
}

class BasicDropdown extends React.Component<IProps> {
    render() {
        return (
            <>
                {this.props.useButton ? (
                    <BasicButton onClick={() => toggleDropdown(this.props.id)} className={"dropbtn"} text={this.props.buttonText} />
                ) : null}
                <div id={this.props.id} className={`DropdownContent ${this.props.className}`} style={this.props.style}>
                    {this.props.children}
                </div>
            </>
        );
    }
}

export default BasicDropdown;
