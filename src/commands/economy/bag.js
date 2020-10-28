const user = require('../../models/user')
const Discord = require('discord.js');
module.exports = {
    name: 'bag',
    description: 'Muestra las cosas que tienes en tu mochila',
    usage: 'bag',
    aliases: ['inventory', 'mochila'],
    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
    category: __dirname.split(require('path').sep).pop(),
    disable: true,

    execute: async (message, args) => {
        let config = await user.findOne({userId: message.author.id})
        let bag = config.inventory.bag

        const embedBag = new Discord.MessageEmbed()
            .setAuthor(`Mochila de ${message.author.username}`, message.author.displayAvatarURL())
            .setColor('RANDOM')
            .setThumbnail(`https://pbs.twimg.com/media/DfH9bqqV4AAJkc5.jpg`)
            .setDescription('')
        if (!bag.length) {
            embedBag.setDescription('No hay objetos en tu mochila u.u')

        } else {
            embedBag.addField('Lista de items', bag.map(item=> {
                return `• ${item.item} (x${item.cantidad})`
            }))
        }
        message.channel.send(embedBag)
    }
}
