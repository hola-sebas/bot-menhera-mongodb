const gif = require('tnai');
const tnai = new gif();
const Discord = require('discord.js');

module.exports = {
    name: 'bored',
    description: 'Estas aburrido?',
    usage: 'bored',
    category: __dirname.split('\\').pop(),
    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
    disable: true,
    execute: async (message, args) => {

        new Promise(async (resolve, reject) => {
            let gif = await tnai.sfw.bored();
            const embed = new Discord.MessageEmbed()
                .setTitle(`${message.author.username} Esta aburrido 🥱`)
                .setImage(gif)
                .setColor("RANDOM");
            message.channel.send(embed);
            resolve(gif)
        })
    }
}