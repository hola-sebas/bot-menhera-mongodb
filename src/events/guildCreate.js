const ascii = require('ascii-table')
module.exports = {
    name: 'guildCreate',
    run: async (client, guild) => {
        let message = {}
        message.guild = guild
        require('../modules/GuildDatabase').run(message, client)
        console.log('\nMe añadieron a un servidor!!!');
        var tabla = new ascii().setHeading('Nombre', 'ID', 'Usuarios', 'Roles', 'Canales')
        var numUsu = 0
        var numRoles = 0
        var numCan = 0
        guild.members.cache.map(() => numUsu++)
        guild.roles.cache.map(() => numRoles++)
        guild.channels.cache.map(() => numCan++)
        tabla.addRow(guild.name, guild.id, numUsu, numRoles, numCan)
        console.log(tabla.toString());
        process.stdout.write('->')
    }
}