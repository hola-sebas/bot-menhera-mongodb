import Discord from 'discord.js';
import { bot_commands, permissions } from '../../@types/bot-commands';
import { categoryOptions } from './index';
import IClient from '../../@types/discord-client';
import interfaceGuildModel from '../../@types/mongo/guild-model';
import interfaceUserModel from '../../@types/mongo/user-model';

export default new class command_mine implements bot_commands {
    name = 'mine';
    description = 'Mina para ganar minerales';
    usage = 'mine';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    cooldown = 1800;

    async execute(message: Discord.Message, args: string[], _client: IClient, _guildDatabase: interfaceGuildModel, memberDatabase: interfaceUserModel): Promise<void> {
        if (args.length) return;

        var random = Math.round(Math.random() * (11 - 1) + 1);
        var minRandom = Math.round(Math.random() * categoryOptions.minerales.length);
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Haz ganado');
        let memberBag = memberDatabase.inventory.bag;
        let memberBagIndex = memberBag.findIndex(bagItem => bagItem.item == categoryOptions.minerales[minRandom]);
        var itemQuantity: number = 0;

        memberBag.forEach(bagItem => {
            if (bagItem.item == categoryOptions.minerales[minRandom]) {
                return itemQuantity = bagItem.cantidad;
            };
        });

        if (memberBagIndex != -1) {
            memberDatabase.inventory.bag.splice(memberBagIndex, 1, {
                item: `${categoryOptions.minerales[minRandom]}`,
                cantidad: itemQuantity + random
            });
        } else {
            memberDatabase.inventory.bag.push({ item: categoryOptions.minerales[minRandom], cantidad: random });
        }

        let winnedMoney = Math.round(Math.random() * (21 - 5) + 5);
        memberDatabase.money.efectivo = + winnedMoney;
        embed.setDescription(`• **Minerales**: ${categoryOptions.minerales[minRandom]} (x${random})\n• **Coins**: ${winnedMoney}`);
        message.channel.send(embed);
        memberDatabase.save();
    };
};
