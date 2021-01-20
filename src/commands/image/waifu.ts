import Discord, { Message } from 'discord.js'
import { bot_commands, permissions } from '../../@types/bot-commands'
import { categoryOptions } from './index'

export default new class command_waifu implements bot_commands {
    name = 'waifu';
    description = 'Te doy una waifu aleatoria';
    usage = 'waifu';
    aliases = ['w'];
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    cooldown = 5;

    execute = function (message: Message, args: string[]): void {
        let random = Math.round(Math.random() * categoryOptions.waifus.length);
        const embed = new Discord.MessageEmbed()
            .setDescription(`**<@${message.author.id}> aqui esta tu waifu**`)
            .setColor('RANDOM')
            .setImage(categoryOptions.waifus[random])
            .setFooter(`waifu: ${random}`);
        message.channel.send(embed);
        return;
    }
}
