import { Document } from "mongoose";
import { bot_commands, permissions } from "../bot-commands";

export default interface commands_model extends Document {
    commands: Array<commands>;
    categories: Array<category>;
}

interface commands {
    name: string;
    description: string;
    usage: string;
    aliases: Array<string>;
    permissions: permissions[];
    category: string;
    disable: boolean;
    cooldown: number;
};

interface category {
    name: string | undefined;
    canDisable: boolean;
    description: string;
}
