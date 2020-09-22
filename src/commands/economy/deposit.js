const user = require('../../models/user')
module.exports = {
    name: 'deposit',
    description: 'Deposita tu dinero en el banco',
    usage: 'deposit < cantidad / all >',
    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
    category: __dirname.split('\\').pop(),
    disable: true,
    execute: async (message, args) => {
        if (!args.length) return message.channel.send('Debes poner una cantidad a depositar o all para depositar todo')
        const config = await user.findOne({ userId: message.author.id })
        let efectivo = config.money.efectivo
        if (efectivo == 0) return message.channel.send('No tienes efectivo para depositar')
        if (args[0] == 'all') {
            let dineroActualizado = config.money.bank += efectivo
            config.money.efectivo = 0
            config.save()
            message.channel.send(`Depositaste todos tus fondos a el banco ahora tienes ${dineroActualizado}\$ en tu banco`)
            return
        }
        'use strict';
        let dineroADepositar = parseInt(args[0])
        if (isNaN(dineroADepositar)) return message.channel.send('Debes colocar un numero')
        if (dineroADepositar > efectivo) return message.channel.send('No tienes fondos suficientes')
        config.money.efectivo -= dineroADepositar
        config.money.bank += dineroADepositar
        config.save()
        message.channel.send(`Depositaste ${dineroADepositar}\$ a tu banco`)
    }
}