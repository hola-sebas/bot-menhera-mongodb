import { PresenceData } from "discord.js";
import IClient from "../../@types/discord-client";

export default async function run(client: IClient) {
    setInterval(() => {
        client.user.setPresence({
            activity: states[statesCount],
            status: "online"
        });
        statesCount++;
        if (statesCount > states.length) statesCount = 0;

    }, 20000);
    var statesCount = 0;
    var states: PresenceData["activity"][] = [
        {
            name: "nueva pagina :D",
            type: "STREAMING",
            url: "https://menherachan.herokuapp.com",
        },
        {
            name: `${client.users.cache.size} Usuarios`,
            type: "WATCHING"
        },
        {
            name: `${client.guilds.cache.size} Servidores`,
            type: "WATCHING"
        },
        {
            name: `${client.channels.cache.size} Canales`,
            type: "WATCHING"
        }
    ];
}
