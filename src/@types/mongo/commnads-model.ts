import { Document } from "mongoose";
import { bot_commands, permissions } from "../bot-commands";

export default interface commands_model extends Document {
    commands: Array<commands>;
    categories: Array<string>;
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

