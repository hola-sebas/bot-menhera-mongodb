const render = require('../../modules/images/rank'),
    userdb = require('../../models/user');
module.exports = {
    name: 'xp',
    description: 'Muestra tu xp actual o de otro usuario',
    usage: 'xp (mencion)',
    category: __dirname.split(require('path').sep).pop(),
    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
    disable: true,
    cooldown: 30,
    execute: async (message, args, prefix, client) => {
        message.channel.startTyping()
        let user = message.mentions.users.first() || message.author
        if (user.id == client.user.id) return message.channel.send('Esa soy yo!\nTengo un nivel I N F I N I T O (⌐■_■)')
        let config = await userdb.findOne({ userId: user.id })
        if (!config) return message.channel.send('hmm no tengo datos de ese usuario')
        let level = config.xp.nivel
        let curXp = config.xp.actual
        let needXP = config.xp.necesario
        let color = config.xp.color
        let url = config.xp.url
        try {
            let img = await render.run(user, color, level, curXp, needXP, url)
            if(!img) throw 'No se ha podido renderizar la terjeta de xp por favor ejecuta xpcard y cambia la imagen de fondo';
            message.channel.send({ files: [img] })
            message.channel.stopTyping()
        } catch (err) {
            message.channel.send(err)
            message.channel.stopTyping()
        }
    }
}   