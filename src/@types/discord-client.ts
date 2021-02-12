import Discord from "discord.js";
import { bot_commands } from "./bot-commands";

export default interface IClient extends Discord.Client {
    commands: Discord.Collection<bot_commands["name"], bot_commands>;
    categories: Map<string | undefined, category>;
    user: Discord.ClientUser
}

interface category {
    name: string | undefined;
    canDisable: boolean;
    description: string;
}
