import Discord, { Message } from 'discord.js';
import tnai from "../../tnai-client";
import { bot_commands, permissions } from '../../@types/bot-commands';

export default new class command_blush implements bot_commands {
    name = 'blush';
    description = '😊';
    usage = 'blush';
    category = __dirname.split(require('path').sep).pop();
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    disable = true;
    
    execute = async function (message: Message, args: string[]): Promise<void> {
        let gif = await tnai.sfw.blush();
        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.author.username} esta sonrrojado 😊`)
            .setImage(gif)
            .setColor("RANDOM");
        message.channel.send(embed);
    }
}
