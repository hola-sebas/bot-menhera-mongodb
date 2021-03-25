import { Guild } from "discord.js";
import IClient from "../@types/discord-client";

import guildDB from '../models/guild';
export default new class event_guildDelete {
    name = 'guildDelete';
    run = async function (_client: IClient, guild: Guild): Promise<void> {
        console.log(`A guild has been deleted: (${guild.id})`);
        await guildDB.findOneAndDelete({ guildID: guild.id });
        console.log(`The database was successfully removed from the server`);
    };
};
