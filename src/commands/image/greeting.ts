import Discord, { Message } from 'discord.js';
import tnai from "../../tnai-client";
import { bot_commands, permissions } from '../../@types/bot-commands';
import IClient from '../../@types/discord-client';

export default new class command_greeting implements bot_commands{
    name = 'greeting';
    description = 'Saluda a alguien';
    usage = 'greeting <@usuario>';
    category = __dirname.split(require('path').sep).pop();
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    disable = true;
    
    execute = async (message: Message, args: string[], client: IClient) => {
        let usu = message.mentions.users.first()
        if (!usu) {
            message.channel.send('Debes mencionar un usuario para saludar')
            return
        }
        let gif = await tnai.sfw.greeting();
        const embed = new Discord.MessageEmbed()
            .setImage(gif)
            .setColor("RANDOM");
        if (usu.id == client.user.id) {
            embed.setTitle(`${message.author.username} Hola!`)
            message.channel.send(embed)
            return
        }
        if (usu.id == message.author.id) {
            embed.setTitle(`${message.author.username} auto saludate!`)
            message.channel.send(embed)
            return
        }
        embed.setTitle(`${usu.username} dile hola a ${message.author.username}`)
        message.channel.send(embed);
        return;
    }
}
