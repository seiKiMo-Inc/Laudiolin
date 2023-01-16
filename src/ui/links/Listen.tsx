import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { listenAlongWith } from "@backend/gateway";

import { Pages } from "@app/constants";

function Listen() {
    // Get the user ID parameter.
    const { userId } = useParams();
    const navigate = useNavigate();

    // Try to open in Laudiolin.
    // @ts-ignore
    window.location = `laudiolin://listen?id=${userId}`;

    // Listen with the user.
    listenAlongWith(userId);

    // Wait for the page to load.
    // Navigate to the home page.
    useEffect(() => navigate(Pages.home));

    return (
        <></>
    );
}

export default Listen;