import Discord, { Message } from 'discord.js';
import tnai from "../../tnai-client";
import { bot_commands, permissions } from '../../@types/bot-commands';

export default new class command_confused implements bot_commands {
    name = 'confused';
    description = 'Confundido?';
    usage = 'confused';
    category = __dirname.split(require('path').sep).pop();
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    disable = true;
    
    execute = async (message: Message, args: string[]) => {
        let gif = await tnai.sfw.confused();
        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.author.username} Esta confundido 😕`)
            .setImage(gif)
            .setColor("RANDOM");
        message.channel.send(embed);
    }
}
