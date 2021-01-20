import { Guild } from "discord.js";
import IClient from "../@types/discord-client";

import guildDB from '../models/guild';
export default new class event_guildDelete {
    name = 'guildDelete';
    run = async function (_client: IClient, guild: Guild): Promise<void> {
        console.log(`\nHe sido eliminado de el servidor ${guild.name}`);
        guildDB.findOneAndDelete({ guildId: guild.id })
        console.log(`Se a eliminado correctamente la base de datos el el servidor`, guild.id);
        process.stdout.write('->')
    }
}
