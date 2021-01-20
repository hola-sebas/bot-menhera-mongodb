import Discord, { Message } from 'discord.js';
import gif from 'tnai';
import { bot_commands, permissions } from '../../@types/bot-commands';
const tnai = new gif();

export default new class command_dance implements bot_commands {
    name = 'dance';
    description = 'Empieza a bailar!';
    usage = 'dance';
    category = __dirname.split(require('path').sep).pop();
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    disable = true;
    execute = async (message: Message, args: string[]) => {
        let gif = await tnai.sfw.dance();
        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.author.username} Comenzo a bailar!`)
            .setImage(gif)
            .setColor("RANDOM");
        message.channel.send(embed);
    }
}
