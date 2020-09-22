const Discord = require("discord.js")
const bugs = require('../../models/bugs')
module.exports = {
    name: 'ping',
    description: 'Muestra el ping entre la API de Discord y el bot',
    usage: 'ping',
    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
    category: __dirname.split('\\').pop(),
    disable: true,

    execute: async (message, args) => {
        let date1 = Date.now()
        let pingdb = await bugs.find()
        let date2 = Date.now()
        let ping = Math.round(message.client.ws.ping);
        const embed = new Discord.MessageEmbed()
            .setDescription(`🏓 Pong DiscordAPI: \`${ping} ms\`\n💾 Pong Base de datos: \`${date2 - date1} ms\``)
            .setColor("RANDOM")
        message.channel.send(embed);
    }
}
