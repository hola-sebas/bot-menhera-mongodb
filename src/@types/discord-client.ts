import Discord from "discord.js";
import { bot_commands } from "./bot-commands";

export default interface IClient extends Discord.Client {
    commands: Discord.Collection<bot_commands["name"], bot_commands>;
    categoria: Map<string | undefined, category>;
    console: Discord.Collection<any, any>;
    user: Discord.ClientUser
}

interface category {
    name: string | undefined;
    canDisable: boolean;
    description: string;
}
