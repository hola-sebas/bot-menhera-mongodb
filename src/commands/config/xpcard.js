const render = require('../../modules/images/rank'),
    regex = require('hex-color-regex'),
    userdb = require('../../models/user')
module.exports = {
    name: 'xpcard',
    description: 'Configura la imagen de fondo de tu tarjeta de xp y tambien el color (opcional)',
    usage: 'xpcard <link> (color)',
    category: __dirname.split(require('path').sep).pop(),
    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
    disable: false,
    cooldown: 10,
    execute: async (message, args) => {
        let url = args[0]
        let argsColor = args[1] || '#cd5c5c'
        if (!url) return message.channel.send('Debes poner el link de la imagen que quieres de fondo')
        let user = message.author
        let config = await userdb.findOne({ userId: user.id })
        let color = config.xp.color
        let level =  config.xp.nivel
        let currentXP = config.xp.actual
        let needXP =  config.xp.necesario
        try {

            if (regex().test(argsColor)) {
                config.xp.color = argsColor
                color = config.xp.color
            }
            let img = await render.run(user, color, level, currentXP, needXP, url)
            message.channel.send('Ok este seria un ejemplo de tu tarjeta de xp', { files: [img] })
            config.xp.url = url
            config.save()

        } catch (err) {
            message.channel.send(err.toString())
        }
    }
}