import { Message } from 'discord.js';
import { bot_commands, permissions } from '../../@types/bot-commands';
import IClient from '../../@types/discord-client';
import interfaceGuildModel from '../../@types/mongo/guild-model';
import interfaceUserModel from '../../@types/mongo/user-model';

export default new class command_withdraw implements bot_commands {
    name = 'withdraw';
    description = 'Saca dinero de tu banco';
    usage = 'withdraw < [cantidad] / all >';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;

    async execute(message: Message, args: string[], _client: IClient, _guildDatabase: interfaceGuildModel, memberDatabase: interfaceUserModel): Promise<void> {
        if (!args[0]) {
            message.channel.send('Debes colocar un numero o all');
            return;
        }
        let moneyBanco = memberDatabase.money.bank;
        if (moneyBanco == 0) {
            message.channel.send('No tienes dinero en el banco');
            return;
        }
        if (args[0] == 'all') {
            memberDatabase.money.bank = 0;
            memberDatabase.money.efectivo += moneyBanco;
            memberDatabase.save();
            message.channel.send(`Sacaste ${moneyBanco}\$ de tu banco`);
            return;
        }
        let moneySacar = parseInt(args[0]);
        if (isNaN(moneySacar)) {
            message.channel.send('Debes colocar un numero');
            return;
        }
        if (moneyBanco < moneySacar) {
            message.channel.send('No tienes ese dinero en el banco');
            return;
        }
        memberDatabase.money.bank -= moneySacar;
        memberDatabase.money.efectivo += moneySacar;
        await memberDatabase.save();
        message.channel.send(`Sacaste ${moneySacar}\$ de tu banco`);
    };
};
