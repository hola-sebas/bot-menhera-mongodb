import { categoryOptions } from './index';
import user from '../../models/user';
import Discord, { Message } from 'discord.js';
import { bot_commands, permissions } from '../../@types/bot-commands';
import IClient from '../../@types/discord-client';
import interfaceGuildModel from '../../@types/mongo/guild-model';
import interfaceUserModel from '../../@types/mongo/user-model';

export default new class command_work implements bot_commands {
    name = 'work';
    description = 'Trabaja como un buen ser humano';
    usage = 'work';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    cooldown = 10;
    async execute(message: Message, args: string[], _client: IClient, _guildDatabase: interfaceGuildModel, memberDatabase: interfaceUserModel): Promise<void> {
        let moneyGanada = Math.round(Math.random() * 20);
        memberDatabase.money.efectivo += moneyGanada;
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${categoryOptions.trabajos[(Math.floor(Math.random() * categoryOptions.trabajos.length))]}, ganaste ${moneyGanada}\$`);
        message.channel.send(embed);
        await memberDatabase.save();
    };
};
