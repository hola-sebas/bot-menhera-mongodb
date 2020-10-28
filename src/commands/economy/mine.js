const { minerales } = require('./index.json'),
    Discord = require('discord.js'),
    user = require('../../models/user');

module.exports = {
    name: 'mine',
    description: 'Mina para ganar minerales',
    usage: 'mine',
    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
    category: __dirname.split(require('path').sep).pop(),
    disable: true,
    cooldown: 1800,

    execute: async (message, args) => {
        let config = await user.findOne({ userId: message.author.id })
        var random = Math.round(Math.random() * (11 - 1) + 1)
        var minRandom = Math.round(Math.random() * minerales.length)
        if (args.length) return

        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Haz ganado')
        let y = config.inventory.bag
        let index = y.findIndex(u => u.item == minerales[minRandom])
        var si
        y.map(n => {
            if (n.item == minerales[minRandom]) {
                return si = n.cantidad
            } else {
                return
            }
        });

        if (index != -1) {
            config.inventory.bag.splice(index, 1, { item: `${minerales[minRandom]}`, cantidad: parseInt(si) + parseInt(random) })
            let p = config.money.efectivo
            let money = Math.round(Math.random() * (21 - 5) + 5)
            config.money.efectivo = parseInt(p) + parseInt(money)
            embed.setDescription(`• **Minerales**: ${minerales[minRandom]} (x${random})\n• **Coins**: ${money}`)
            message.channel.send(embed)

        } else {
            config.inventory.bag.push({ item: minerales[minRandom], cantidad: random })
            let x = config.money.efectivo
            let money = Math.round(Math.random() * (21 - 5) + 5)
            config.money.efectivo = parseInt(x) + parseInt(money)
            embed.setDescription(`• **Minerales** ${minerales[minRandom]} (x${random})\n• **Coins** ${money}`)
            message.channel.send(embed)
        }
        config.save()
    }
}
