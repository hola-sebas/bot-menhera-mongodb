const user = require('../../models/user')
const Discord = require('discord.js')
const fs = require('fs')
module.exports = {
    name: 'rob',
    description: 'robale a un usuario ',
    usage: 'rob <@usuario>',
    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
    cooldown: 7200,
    category: __dirname.split('\\').pop(),
    disable: true,
    execute: async (message, args, prefix, client) => {
        let usuRobado = message.mentions.users.first()
        if (!usuRobado) return message.channel.send('Debes mencionar a un usuario para robar')
        if (usuRobado.id == message.author.id) return message.channel.send('No puedes robarte a ti mismo')
        if (usuRobado.id == client.user.id) return message.channel.send('No puedes robarme a mi >:(')
        const dbUsuRobado = await user.findOne({ userId: usuRobado.id })
        if (!dbUsuRobado) return message.channel.send('Ese usuario no existe :(')
        const dbUsuLadron = await user.findOne({ userId: message.author.id })
        let dineroParaRobar = dbUsuRobado.money.efectivo
        if (dineroParaRobar < 50) {
            message.channel.send('No puedes robarle a alguien que tenga menos de 50$ en efectivo')
            return
        }
        let dineroRobado = Math.round(Math.random() * (Math.round(dineroParaRobar / 4)))
        usuRobado.send(`**Te han robado!**\nEl usuario \`${message.author.tag}\` te a robado \`${dineroRobado}\$\`, ahora tienes \`${dbUsuRobado.money.efectivo -= dineroRobado}\$\`.`)
            .catch(err => err)
        message.channel.send(`le robaste al usuario ${usuRobado}, ahora tienes ${dbUsuLadron.money.efectivo += dineroRobado}\$`)
        dbUsuRobado.save()
        dbUsuLadron.save()
    }
}