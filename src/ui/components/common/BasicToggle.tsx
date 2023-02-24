import React from "react";
import Switch from "react-switch";

import * as settings from "@backend/settings";

/**
 * Returns the enabled color based on the current theme.
 */
function getColor(): string {
    return settings.ui().color_theme == "Light" ? "#ED7D64" : "#3484FC";
}

interface IProps {
    default: boolean;
    color?: string;
    update?: (value: boolean) => void;
}

function BasicToggle(props: IProps) {
    const [enabled, setEnabled] = React.useState<boolean>(props.default);

    return (
        <Switch
            onChange={(state) => {
                setEnabled(state);
                props.update?.(state);
            }}
            checked={enabled}
            onColor={props.color ?? getColor()}
            checkedIcon={false}
            uncheckedIcon={false}
            width={40} height={20}
        />
    );
}

export default BasicToggle;
