const Discord = require('discord.js')
const user = require('../../models/user')
module.exports = {
    name: 'balance',
    description: 'Muestra tu dienro actual',
    usage: 'balance',
    aliases: ['bal'],
    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
    category: __dirname.split(require('path').sep).pop(),
    disable: true,
    execute: async (message, args) => {
        let mentionUser = message.mentions.users.first() || message.author
        const config = await user.findOne({ userId: mentionUser.id })
        let efectivo = config.money.efectivo
        let banco = config.money.bank
        const embedBalance = new Discord.MessageEmbed()
            .addField('💸 Dinero en efectivo:', efectivo)
            .addField('💰 Dinero en el banco:', banco)
            .setColor('RANDOM')
            .setThumbnail('https://i.pinimg.com/236x/e1/8f/7f/e18f7f366746dfe6026a81eac8e982f5.jpg')
            .setFooter('Consultado por: ' + message.member.displayName, message.author.displayAvatarURL())
        if (mentionUser.id == message.author.id) {
            embedBalance.setTitle('Acerca de tu dinero')
        } else {
            embedBalance.setTitle(`Acerca del dinero de ${mentionUser.username}`)
        };
        message.channel.send(embedBalance)
    }
}
