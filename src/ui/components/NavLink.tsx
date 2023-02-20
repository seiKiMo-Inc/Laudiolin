import React from "react";

import type { Page } from "@backend/types";
import { navigate, registerListener } from "@backend/navigation";

interface IProps {
    to: Page;
    with?: any;

    children: ((props: {
        isActive: boolean;
    }) => React.ReactNode);
    className?: string;
    style?: ((props: {
        isActive: boolean;
    }) => React.CSSProperties | undefined);
}

interface IState {
    isActive: boolean;
}

class NavLink extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            isActive: false
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
        registerListener(({ page }) =>
            page != this.props.to && this.setState({ isActive: false }));
    }

    render() {
        const { isActive } = this.state;

        return (
            <div
                className={this.props.className}
                style={this.props.style?.({ isActive })}
                onClick={() => this.goTo()}
            >
                { this.props.children({ isActive }) }
            </div>
        );
    }
}

export default NavLink;
