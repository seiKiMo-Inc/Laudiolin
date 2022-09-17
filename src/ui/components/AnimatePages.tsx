import React from "react";
import { motion } from "framer-motion";
import { PageTransitions } from "@app/constants";

interface IProps {
    children: any;
}

class AnimatePages extends React.Component<IProps, any> {
    render() {
        return (
            <motion.div
                initial={PageTransitions.initial}
                animate={PageTransitions.animate}
                exit={PageTransitions.exit}
                transition={PageTransitions.transition}
            >
                {this.props.children}
            </motion.div>
        );
    }
}

export default AnimatePages;
