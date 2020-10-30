const { trabajos } = require('./index.json')
const user = require('../../models/user')
const Discord = require('discord.js')
module.exports = {
    name: 'work',
    description: 'Trabaja como un buen ser humano',
    usage: 'work',
    category: __dirname.split(require('path').sep).pop(),
    disable: true,
    cooldown: 10,
    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
    execute: async (message, args) => {
        const config = await user.findOne({userId: message.author.id})
        let moneyGanada = Math.round(Math.random() * 20)
        config.money.efectivo += moneyGanada
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${trabajos[(Math.floor(Math.random() * trabajos.length))]}, ganaste ${moneyGanada}\$`)
        message.channel.send(embed)
        config.save()
    }
}