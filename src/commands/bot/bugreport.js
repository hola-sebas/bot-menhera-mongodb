const bugs = require('../../models/bugs')
require('path').sep
module.exports = {
    name: 'bugreport',
    description: 'Reporta un bug que encontraste por ahí',
    usage: 'bugreport <bug>',
    aliases: ['bug'],
    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
    category: __dirname.split(require('path').sep).pop(),
    disable: true,
    cooldown: 120,
    execute: async (message, args) => {
        try {
            if (!args.length) return message.channel.send('Debes poner un bug para reportar')
            let config = await bugs.findOne({ userId: message.author.id })
            let bug = args.join(' ')
            if (bug.length > 1000) return message.channel.send('No puedes poner un bug mayor a 1000 caracteres')
            if (!config) {
                const newBug = new bugs({
                    userId: message.author.id,
                    username: message.author.username,
                    bug: [bug]
                })
                newBug.save()
                message.channel.send('Se a reportado el bug correctamente, gracias por apoyar a mejorar este bot')
            } else {
                config.bug.push(bug)
                await bugs.findOneAndUpdate({ userId: message.author.id }, {
                    userId: message.author.id,
                    username: message.author.username,
                    bug: config.bug
                })
                message.channel.send('Se a reportado el bug correctamente, gracias por apoyar a mejorar este bot')
            }
        } catch (err) {
            message.channel.send('Lo siento hubo un error al reportar el bug :(')
            console.log('\n', err);
            process.stdout.write('->')
        }
    }
}