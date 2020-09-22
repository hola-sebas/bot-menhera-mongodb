const guild = require('../models/guild')
module.exports = {
    name: 'guildMemberRemove',
    run: async (client, member) => {
        let config = await guild.findOne({guildId: member.guild.id})
        let idCanal = config.mensajes.goodbye.channel
        if (idCanal == 0) return
        let canal = client.channels.cache.find(c => c.id == idCanal)
        let mensaje = config.mensajes.goodbye.message
        let regexUser = /{user}/g
        let regexGuild = /{guild}/g
        let regexMemberCount = /{membercount}/g
        mensaje = mensaje.replace(regexUser, member.user.tag).replace(regexGuild, member.guild.name).replace(regexMemberCount, member.guild.memberCount)
        canal.send(mensaje)
    }
}