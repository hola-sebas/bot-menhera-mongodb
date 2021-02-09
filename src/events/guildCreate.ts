import ascii from 'ascii-table';
import { Guild } from 'discord.js';
import IClient from '../@types/discord-client';
import guildDB from "../modules/GuildDatabase";

export default new class event_guildCreate {
    name = 'guildCreate';

    run = async function (client: IClient, guild: Guild): Promise<void> {
        await guildDB({ guild }, client);
        console.log('\nNew Server!!!');
        var tabla = new ascii().setHeading('Nombre', 'ID', 'Usuarios', 'Roles', 'Canales');
        var numUsu = guild.members.cache.size;
        var numRoles = guild.roles.cache.size;
        var numCan = guild.channels.cache.size;
        tabla.addRow(guild.name, guild.id, numUsu, numRoles, numCan);
        console.log(tabla.toString());
    };
};
