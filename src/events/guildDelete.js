const guildDB = require('../models/guild')
module.exports = { 
    name: 'guildDelete',
    run(client, guild) {
        console.log(`\nHe sido eliminado de el servidor ${guild.name}`);
        guildDB.findOneAndDelete({guildId: guild.id})
        console.log(`Se a eliminado correctamente la base de datos el el servidor`, guild.id);
        process.stdout.write('->')
    }
}