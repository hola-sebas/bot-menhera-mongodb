import Discord, { Message } from 'discord.js';
import tnai from "../../tnai-client";
import { bot_commands, permissions } from '../../@types/bot-commands';

export default new class command_bored implements bot_commands {
    name = 'bored';
    description = 'Estas aburrido?';
    usage = 'bored';
    category = __dirname.split(require('path').sep).pop();
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    disable = true;

    execute = async function (message: Message, args: string[]): Promise<void> {
        let gif = await tnai.sfw.bored();
        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.author.username} Esta aburrido 🥱`)
            .setImage(gif)
            .setColor("RANDOM");
        message.channel.send(embed);
    }
}
