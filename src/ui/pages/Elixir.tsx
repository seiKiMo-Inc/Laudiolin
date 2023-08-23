import React from "react";

import Alert from "@components/Alert";
import AnimatedView from "@components/common/AnimatedView";

import { setGuild, getGuilds } from "@backend/elixir";
import type { Guild } from "@backend/types";

import "@css/pages/Elixir.scss";

/**
 * Shortens a name.
 *
 * @param name The name to shorten.
 */
function computeName(name: string): string {
    return name.length > 20 ? `${name.slice(0, 20)}...` : name;
}

/**
 * Shortens a name to the initials of each word.
 *
 * @param name The name to shorten.
 */
function shortenName(name: string): string {
    return name
        .split(" ")
        .map(word => word[0])
        .join("");
}

function Icon(props: { guild: Guild }) {
    const { guild } = props;

    const [loaded, setLoaded] = React.useState(true);

    return loaded && guild.icon != null ? (
        <img
            alt={shortenName(guild.name)}
            style={{
                backgroundColor: loaded ? "transparent" : "var(--background-primary-color)"
            }}
            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=96`}
            onError={() => setLoaded(false)}
        />
    ) : (
        <div className={"Elixir_BlankServer"}>
            <p>{shortenName(guild.name)}</p>
        </div>
    );
}

interface IState {
    guilds: Guild[] | null;
}

class Elixir extends React.Component<{}, IState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            guilds: []
        };
    }

    /**
     * Selects a server.
     */
    private selectServer(guild: Guild): void {
        if (guild.bots.length == 0) {
            Alert.showAlert(`No Elixirs found in ${guild.name}`);
            return;
        }

        Alert.showAlert(`Selected ${guild.name}`);
        setGuild(guild.id);
    }

    componentDidMount() {
        getGuilds()
            .then(guilds => {
                guilds = guilds
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .sort((a, b) => b.bots.length - a.bots.length);
                this.setState({ guilds });
            })
            .catch(console.error);
    }

    render() {
        return (
            <AnimatedView className={"Elixir"}>
                <h2>Elixir</h2>

                {
                    this.state.guilds == null ? (
                        <div className={"flex empty"}>
                            <h1>No guilds found</h1>
                            <p>Please log in again (or link a Discord account) to use this feature.</p>
                        </div>
                    ) : this.state.guilds.length == 0 ? (
                        <div className={"flex empty"}>
                            <h1>Loading guilds</h1>
                            <p>This might take a bit...</p>
                        </div>
                    ) : (
                        <div className={"Elixir_ServerList"}>
                            { this.state.guilds.map((guild, index) => (
                                <div className={"Elixir_Server"} key={index}
                                     onClick={() => this.selectServer(guild)}
                                     style={{
                                         filter: guild.bots.length == 0 ? "brightness(50%)" : "none"
                                     }}
                                >
                                    <Icon guild={guild} />
                                    <p>{computeName(guild.name)}</p>
                                </div>
                            )) }
                        </div>
                    )
                }
            </AnimatedView>
        );
    }
}

export default Elixir;
