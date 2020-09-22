const guild = require('../../models/guild')

module.exports = {
    name: 'autoreply',
    description: 'Configura si deseas que responda a mensajes automaticamente',
    usage: 'autoreply',
    aliases: ['reply'],
    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
    category: __dirname.split('\\').pop(),
    disable: false,
    cooldown: 5,

    execute: async (message, args) => {
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('No tienes permisos para hacer eso ').then(m => m.delete({ timeout: 5000 }))

        let config = await guild.findOne({ guildId: message.guild.id })
        let activado = config.mensajes.autoReply
        if (activado == undefined || activado == true) {
            config.mensajes.autoReply = false
            config.save()
            message.channel.send('Ok **Desactive** la respuesta automatica a mensajes')
        }
        if (activado == false) {
            config.mensajes.autoReply = true
            config.save()
            message.channel.send('Ok **Active** la respuesta automatica a mensajes')
        }
    }
}
