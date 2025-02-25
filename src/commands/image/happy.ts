import Discord, { Message } from 'discord.js';
import tnai from "../../tnai-client";
import { bot_commands, permissions } from '../../@types/bot-commands';

export default new class command_happy implements bot_commands {
    name = 'happy';
    description = 'Because I\'m happy\nClap along if you feel like happiness is the truth🎼';
    usage = 'happy';
    category = __dirname.split(require('path').sep).pop();
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    disable = true;
    execute = async (message: Message, args: string[]) => {
        let gif = await tnai.sfw.happy();
        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.author.username} esta feliz :D`)
            .setImage(gif)
            .setColor("RANDOM");
        message.channel.send(embed);
    }
}
