import Discord, { Message } from "discord.js";
import IClient from "../../@types/discord-client";
import gif from 'tnai';
import { permissions } from "../../@types/bot-commands";
const tnai = new gif();

export default new class command_feed {
    name = 'feed';
    description = 'Alimenta a alguien';
    usage = 'feed <@usuario>';
    category = __dirname.split(require('path').sep).pop();
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    disable = true;
    
    execute = async (message: Message, args: string[], client: IClient) => {
            let usu = message.mentions.users.first()
            if (!usu) {
                message.channel.send('Debes mencionar un usuario para alimentar')
                return
            }
            let gif = await tnai.sfw.feed();
            const embed = new Discord.MessageEmbed()
                .setImage(gif)
                .setColor("RANDOM");
            if (usu.id == client.user.id) {
                embed.setTitle(`${message.author.username} me esta alimentando :D`);
                message.channel.send(embed);
                return;
            }
            if (usu.id == message.author.id) {
                embed.setTitle(`${message.author.username} Se esta alimentando`);
                message.channel.send(embed);
                return;
            }
            embed.setTitle(`${message.author.username} esta alimentando a ${usu.username}`);
            message.channel.send(embed);
            return;
    }
}
