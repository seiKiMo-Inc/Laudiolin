import type { Guild } from "@backend/types";
import { targetRoute, token } from "@backend/user";

/**
 * Fetches the user's guilds.
 *
 * @return null if the user did not give permission to access guilds.
 */
export async function getGuilds(): Promise<Guild[] | null> {
    try {
        const response = await fetch(`${targetRoute}/elixir/guilds`, {
            headers: { Authorization: token() }
        });

        if (response.status != 200) {
            return null;
        } else {
            // Extract the guilds from the response.
            const data = await response.json();
            return data["guilds"] as Guild[];
        }
    } catch {
        return null;
    }
}
