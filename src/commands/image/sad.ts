import Discord, { Message } from 'discord.js';
import gif from 'tnai';
import { bot_commands, permissions } from '../../@types/bot-commands';
const tnai = new gif();

export default new class command_sad implements bot_commands {
    name = 'sad';
    description = 'I\'m sad and low, yeah\nI\'m sad and low, yeah';
    usage = 'sad';
    category = __dirname.split(require('path').sep).pop();
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    disable = true;

    execute = async (message: Message, args: string[]) => {
        let gif = await tnai.sfw.sad();
        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.author.username} esta triste :(`)
            .setImage(gif)
            .setColor("RANDOM");
        message.channel.send(embed);
    }
}
