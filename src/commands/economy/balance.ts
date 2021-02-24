import Discord from 'discord.js';
import { bot_commands, permissions } from '../../@types/bot-commands';
import IClient from '../../@types/discord-client';
import interfaceGuildModel from '../../@types/mongo/guild-model';
import interfaceUserModel from '../../@types/mongo/user-model';
import usersModel from '../../models/user';

export default new class command_balance implements bot_commands {
    name = 'balance';
    description = 'Muestra tu dienro actual';
    usage = 'balance';
    aliases = ['bal'];
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;

    async execute(message: Discord.Message, _args: string[], _client: IClient, _guildDatabase: interfaceGuildModel, memberDatabase: interfaceUserModel): Promise<void> {
        var user = message.mentions.users.first() || message.author;
        if (message.mentions.users.first()) {
            var database = await usersModel.findOne({ userID: user.id });
            if (!database) {
                message.channel.send(`Lo siento pero no tengo datos de ${user.username}`);
                return;
            }
            memberDatabase = database;
        }
        const embedBalance = new Discord.MessageEmbed()
            .addField('💸 Dinero en efectivo:', memberDatabase.money.efectivo)
            .addField('💰 Dinero en el banco:', memberDatabase.money.bank)
            .setColor('RANDOM')
            .setThumbnail('https://i.pinimg.com/236x/e1/8f/7f/e18f7f366746dfe6026a81eac8e982f5.jpg')
            .setFooter('Consultado por: ' + message.member?.displayName, message.author.displayAvatarURL());
        if (user.id == message.author.id) {
            embedBalance.setTitle('Acerca de tu dinero');
        } else {
            embedBalance.setTitle(`Acerca del dinero de ${user.username}`);
        };
        message.channel.send(embedBalance);
        return;
    };
};
