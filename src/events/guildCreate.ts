import ascii from 'ascii-table'
import { Guild } from 'discord.js';
import IClient from '../@types/discord-client';

export default new class event_guildCreate {
    name = 'guildCreate';
    run = function (client: IClient, guild: Guild): void {
        let message = { guild }
        require('../modules/GuildDatabase').run(message, client);
        console.log('\nMe añadieron a un servidor!!!');
        var tabla = new ascii().setHeading('Nombre', 'ID', 'Usuarios', 'Roles', 'Canales');
        var numUsu = guild.members.cache.size;
        var numRoles = guild.roles.cache.size;
        var numCan = guild.channels.cache.size;
        tabla.addRow(guild.name, guild.id, numUsu, numRoles, numCan)
        console.log(tabla.toString());
        process.stdout.write('->');
    }
}
