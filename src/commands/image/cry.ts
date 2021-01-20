import { Message } from "discord.js";

import Discord from 'discord.js';
import gif from 'tnai';
import { bot_commands, permissions } from "../../@types/bot-commands";
const tnai = new gif();

export default new class command_cry implements bot_commands {
    name = 'cry';
    description = 'T-T';
    usage = 'cry';
    category = __dirname.split(require('path').sep).pop();
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    disable = true;
    
    execute = async (message: Message, args: string[]) => {
        let gif = await tnai.sfw.cry();
        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.author.username} esta llorando T-T`)
            .setImage(gif)
            .setColor("RANDOM");
        message.channel.send(embed);
    }
}
