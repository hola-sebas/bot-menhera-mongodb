import user from '../../models/user';
import Discord from 'discord.js';
import { bot_commands, permissions } from '../../@types/bot-commands';
import IClient from '../../@types/discord-client';
import interfaceGuildModel from '../../@types/mongo/guild-model';
import interfaceUserModel from '../../@types/mongo/user-model';

export default new class command_rob implements bot_commands {
    name = 'rob';
    description = 'robale a un usuario :o';
    usage = 'rob <@usuario>';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    cooldown = 7200;
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    execute = async function (message: Discord.Message, args: string[], client: IClient, _guildDatabase: interfaceGuildModel, memberDatabase: interfaceUserModel): Promise<void> {
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
        let moneyToRob = dbUsuRobado.money.efectivo;
        if (moneyToRob < 50) {
            message.channel.send('No puedes robarle a alguien que tenga menos de 50$ en efectivo');
            return;
        };
        let dineroRobado = Math.round(Math.random() * Math.round(moneyToRob / 4));
        usuRobado.send(`**Te han robado!**\nEl usuario \`${message.author.tag}\` te a robado \`${dineroRobado}\$\`, ahora tienes \`${dbUsuRobado.money.efectivo -= dineroRobado}\$\`.`)
            .catch();
        message.channel.send(`le robaste al usuario ${usuRobado}, ahora tienes ${memberDatabase.money.efectivo += dineroRobado}\$`);
        await dbUsuRobado.save();
        await memberDatabase.save();
        return;
    };
};
