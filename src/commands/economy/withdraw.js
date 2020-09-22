const user = require('../../models/user')
module.exports = {
    name: 'withdraw',
    description: 'Saca dinero de tu banco',
    usage: 'withdraw < [cantidad] / all >',
    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
    category: __dirname.split('\\').pop(),
    disable: true,
    execute: async (message, args) => {
        if (!args[0]) return message.channel.send('Debes colocar un numero o all')
        const config = await user.findOne({ userId: message.author.id })
        let moneyBanco = config.money.bank
        if (moneyBanco == 0) return message.channel.send('No tienes dinero en el banco')
        if (args[0] == 'all') {
            config.money.bank = 0
            config.money.efectivo += moneyBanco
            config.save()
            message.channel.send(`Sacaste ${moneyBanco}\$ de tu banco`)
            return
        }
        let moneySacar = parseInt(args[0])
        if (isNaN(moneySacar)) return message.channel.send('Debes colocar un numero')
        if (moneyBanco < moneySacar) return message.channel.send('No tienes ese dinero en el banco')
        config.money.bank -= moneySacar
        config.money.efectivo += moneySacar
        config.save()
        message.channel.send(`Sacaste ${moneySacar}\$ de tu banco`)
    }
}