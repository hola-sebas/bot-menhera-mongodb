import user from '../../models/user';
import Discord from 'discord.js';
import { bot_commands, permissions } from '../../@types/bot-commands';
import IClient from '../../@types/discord-client';

export default new class command_rob implements bot_commands {
    name = 'rob';
    description = 'robale a un usuario ';
    usage = 'rob <@usuario>';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    cooldown = 7200;
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    execute = async function (message: Discord.Message, args: string[], client: IClient): Promise<void> {
        let usuRobado = message.mentions.users.first();
        if (!usuRobado) {
            message.channel.send('Debes mencionar a un usuario para robar');
            return;
        }
        if (usuRobado.id == message.author.id) {
            message.channel.send('No puedes robarte a ti mismo');
            return;
        }
        if (usuRobado.id == client.user.id) {
            message.channel.send('No puedes robarme a mi >:(');
            return;
        }
        const dbUsuRobado = await user.findOne({ userID: usuRobado.id });
        if (!dbUsuRobado) {
            message.channel.send('Ese usuario no existe :(');
            return;
        }
        const dbUsuLadron = await user.findOne({ userID: message.author.id });
        if (!dbUsuLadron) return;
        let dineroParaRobar = dbUsuRobado.money.efectivo;
        if (dineroParaRobar < 50) {
            message.channel.send('No puedes robarle a alguien que tenga menos de 50$ en efectivo');
            return;
        };
        let dineroRobado = Math.round(Math.random() * (Math.round(dineroParaRobar / 4)));
        usuRobado.send(`**Te han robado!**\nEl usuario \`${message.author.tag}\` te a robado \`${dineroRobado}\$\`, ahora tienes \`${dbUsuRobado.money.efectivo -= dineroRobado}\$\`.`)
            .catch(err => err);
        message.channel.send(`le robaste al usuario ${usuRobado}, ahora tienes ${dbUsuLadron.money.efectivo += dineroRobado}\$`);
        dbUsuRobado.save();
        dbUsuLadron.save();
        return;
    };
};
