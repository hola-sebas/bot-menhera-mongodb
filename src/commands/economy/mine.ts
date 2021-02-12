import Discord from 'discord.js';
import user from '../../models/user';
import { bot_commands, permissions } from '../../@types/bot-commands';
import { categoryOptions } from './index';

export default new class command_mine implements bot_commands {
    name = 'mine';
    description = 'Mina para ganar minerales';
    usage = 'mine';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    cooldown = 1800;

    execute = async function (message: Discord.Message, args: string[]): Promise<void> {
        let config = await user.findOne({ userId: message.author.id });
        if (!config) return;
        var random = Math.round(Math.random() * (11 - 1) + 1);
        var minRandom = Math.round(Math.random() * categoryOptions.minerales.length);
        if (args.length) return;

        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Haz ganado');
        let y = config.inventory.bag;
        let index = y.findIndex(u => u.item == categoryOptions.minerales[minRandom]);
        var si: number = 0;
        y.map(n => {
            if (n.item == categoryOptions.minerales[minRandom]) {
                return si = n.cantidad;
            } else {
                return;
            };
        });

        if (index != -1) {
            config.inventory.bag.splice(index, 1, { item: `${categoryOptions.minerales[minRandom]}`, cantidad: si + random });
            let p = config.money.efectivo;
            let money = Math.round(Math.random() * (21 - 5) + 5);
            config.money.efectivo = p + money;
            embed.setDescription(`• **Minerales**: ${categoryOptions.minerales[minRandom]} (x${random})\n• **Coins**: ${money}`);
            message.channel.send(embed);

        } else {
            config.inventory.bag.push({ item: categoryOptions.minerales[minRandom], cantidad: random });
            let x = config.money.efectivo;
            let money = Math.round(Math.random() * (21 - 5) + 5);
            config.money.efectivo = x + money;
            embed.setDescription(`• **Minerales** ${categoryOptions.minerales[minRandom]} (x${random})\n• **Coins** ${money}`);
            message.channel.send(embed);
        }
        config.save();
    };
};
