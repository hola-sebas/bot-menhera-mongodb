import { Message } from 'discord.js';
import { bot_commands, permissions } from '../../@types/bot-commands';
import user from '../../models/user';

export default new class command_withdraw implements bot_commands {
    name = 'withdraw';
    description = 'Saca dinero de tu banco';
    usage = 'withdraw < [cantidad] / all >';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;

    execute = async function (message: Message, args: string[]): Promise<void> {
        if (!args[0]) {
            message.channel.send('Debes colocar un numero o all');
            return;
        }
        const config = await user.findOne({ userId: message.author.id })
        if (!config) return;
        let moneyBanco = config.money.bank
        if (moneyBanco == 0) {
            message.channel.send('No tienes dinero en el banco');
            return;
        }
        if (args[0] == 'all') {
            config.money.bank = 0
            config.money.efectivo += moneyBanco
            config.save()
            message.channel.send(`Sacaste ${moneyBanco}\$ de tu banco`)
            return
        }
        let moneySacar = parseInt(args[0])
        if (isNaN(moneySacar)) {
            message.channel.send('Debes colocar un numero');
            return;
        }
        if (moneyBanco < moneySacar) {
            message.channel.send('No tienes ese dinero en el banco');
            return;
        }
        config.money.bank -= moneySacar
        config.money.efectivo += moneySacar
        config.save()
        message.channel.send(`Sacaste ${moneySacar}\$ de tu banco`)
    }
}
