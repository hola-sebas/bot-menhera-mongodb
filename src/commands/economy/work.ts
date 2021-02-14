import { categoryOptions } from './index';
import user from '../../models/user';
import Discord, { Message } from 'discord.js';
import { bot_commands, permissions } from '../../@types/bot-commands';

export default new class command_work implements bot_commands {
    name = 'work';
    description = 'Trabaja como un buen ser humano';
    usage = 'work';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    cooldown = 10;
    execute = async (message: Message, args: string[]) => {
        const config = await user.findOne({ userID: message.author.id });
        if (!config) return;
        let moneyGanada = Math.round(Math.random() * 20);
        config.money.efectivo += moneyGanada;
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${categoryOptions.trabajos[(Math.floor(Math.random() * categoryOptions.trabajos.length))]}, ganaste ${moneyGanada}\$`);
        message.channel.send(embed);
        config.save();
    };
};
