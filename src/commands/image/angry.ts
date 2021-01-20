import Discord, { Message } from 'discord.js';
import { bot_commands, permissions } from '../../@types/bot-commands';
import gif from 'tnai';
const tnai = new gif();

export default new class command_angry implements bot_commands {
    name = 'angry';
    description = 'Cuando estas enojado';
    usage = 'angry';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;

    execute = async function (message: Message, args: string[]): Promise<void> {
        let gif = await tnai.sfw.angry();
        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.author.username} esta enajado >:(`)
            .setImage(gif)
            .setColor("RANDOM");
        message.channel.send(embed);
    }
}

