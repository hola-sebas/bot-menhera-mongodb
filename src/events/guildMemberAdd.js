const guild = require('../models/guild')
module.exports = {
    name: 'guildMemberAdd',
    run: async (client, member) => {
        let config = await guild.findOne({ guildId: member.guild.id })
        if (!config) return
        let buscar = config.mensajes.welcome.channel
        if (buscar == 0) return
        let img = config.mensajes.welcome.img
        let msg = config.mensajes.welcome.message
        let regex = /@{member}/g
        let regex1 = /{member}/g
        if (regex.test(msg)) {
            msg = msg.replace(regex, `<@${member.user.id}>`)
        } else if (regex1.test(msg)) {
            msg = msg.replace(regex1, member.user.username)
        }
        msg = msg.replace(/{guild}/g, member.guild.name)
        msg = msg.replace(/{membercount}/g, member.guild.memberCount)

        let canal = client.channels.cache.find(c => c.id == buscar)
        const render = require('../modules/images/card.js')
        let imagen = await render.run(member.user, img).catch(err => err)
        canal.send(`${msg}`, { files: [imagen] }).catch(err => err)
    }
}