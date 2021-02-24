import user from '../../models/user';
import Discord from "discord.js";
import { bot_commands, permissions } from '../../@types/bot-commands';
import interfaceGuildModel, { guildInfo } from '../../@types/mongo/guild-model';
import interfaceUserModel from '../../@types/mongo/user-model';
import IClient from '../../@types/discord-client';

export default new class command_deposit implements bot_commands {
    name = 'deposit';
    description = 'Deposita tu dinero en el banco';
    usage = 'deposit < cantidad / all >';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;

    async execute(message: Discord.Message, args: string[], _client: IClient, _guildDatabase: interfaceGuildModel, memberDatabase: interfaceUserModel): Promise<void> {
        if (!args.length) {
            message.channel.send('Debes poner una cantidad a depositar o all para depositar todo');
            return;
        }
        let efectivo = memberDatabase.money.efectivo;
        if (efectivo == 0) {
            message.channel.send('No tienes efectivo para depositar');
            return;
        }
        if (args[0] == 'all') {
            let dineroActualizado = memberDatabase.money.bank += efectivo;
            memberDatabase.money.efectivo = 0;
            memberDatabase.save();
            message.channel.send(`Depositaste todos tus fondos a el banco ahora tienes ${dineroActualizado}\$ en tu banco`);
            return;
        }
        let dineroADepositar = parseInt(args[0]);
        if (isNaN(dineroADepositar)) {
            message.channel.send('Debes colocar un numero');
            return;
        }
        if (dineroADepositar > efectivo) {
            message.channel.send('No tienes fondos suficientes');
            return;
        }
        memberDatabase.money.efectivo -= dineroADepositar;
        memberDatabase.money.bank += dineroADepositar;
        await memberDatabase.save();
        message.channel.send(`Depositaste ${dineroADepositar}\$ a tu banco`);
    };
};
