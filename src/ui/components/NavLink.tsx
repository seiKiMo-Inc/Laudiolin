import React from "react";

import type { Page } from "@backend/types";
import { navigate, registerListener } from "@backend/navigation";

interface IProps {
    to: Page;
    with?: any;

    children: (props: { isActive: boolean; hover: boolean }) => React.ReactNode;
    className?: string;
    style?: (props: { isActive: boolean }) => React.CSSProperties | undefined;
}

interface IState {
    isActive: boolean;
    hover: boolean;
}

class NavLink extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            isActive: false,
            hover: false
        };
    }

    /**
     * Navigates to this page.
     */
    goTo(): void {
        this.setState({ isActive: true });
        navigate(this.props.to, this.props.with);
    }

    componentDidMount() {
        registerListener(
            ({ page }) =>
                page != this.props.to && this.setState({ isActive: false })
        );
    }

    render() {
        const { isActive, hover } = this.state;

        return (
            <div
                className={this.props.className}
                style={this.props.style?.({ isActive })}
                onClick={() => this.goTo()}
                onMouseOver={() => this.setState({ hover: true })}
                onMouseLeave={() => this.setState({ hover: false })}
            >
                {this.props.children({ isActive, hover })}
            </div>
        );
    }
}

export default NavLink;
