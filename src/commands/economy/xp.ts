import render from '../../modules/images/rank';
import userModel from '../../models/user';
import { bot_commands, permissions } from '../../@types/bot-commands';
import { Message } from 'discord.js';
import IClient from '../../@types/discord-client';
import interfaceGuildModel from '../../@types/mongo/guild-model';
import interfaceUserModel from '../../@types/mongo/user-model';

export default new class command_xp implements bot_commands {
    name = 'xp';
    description = 'Muestra tu xp actual o de otro usuario';
    usage = 'xp (mencion)';
    category = __dirname.split(require('path').sep).pop();
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'];
    disable = true;
    cooldown = 30;

    async execute(message: Message, args: string[], client: IClient, _guildDatabase: interfaceGuildModel, memberDatabase: interfaceUserModel): Promise<void> {
        let user = message.mentions.users.first() || message.author;
        if (user.id == client.user.id) {
            message.channel.send('Esa soy yo!\nTengo un nivel I N F I N I T O (⌐■_■)');
            return;
        }
        if (message.mentions.users.first()) {
            var database = await userModel.findOne({ userID: user.id });
            if (!database) {
                message.channel.send('hmm no tengo datos de el ususario');
                return;
            }
            memberDatabase = database;
        }
        let level = memberDatabase.xp.nivel;
        let curXp = memberDatabase.xp.actual;
        let needXP = memberDatabase.xp.necesario;
        let color = memberDatabase.xp.color;
        let url = memberDatabase.xp.url;
        message.channel.startTyping();
        try {
            let img = await render.run(user, color, level.toString(), curXp, needXP, url);
            if (!img) throw 'No se ha podido renderizar la terjeta de xp por favor ejecuta xpcard y cambia la imagen de fondo';
            message.channel.send({ files: [img] });
            message.channel.stopTyping();
        } catch (err) {
            message.channel.send(process.env.NODE_ENV != "production" ? `${err}` : "Oh no algo salio mal intentalo de nuevo mas tarde");
            message.channel.stopTyping();
        }
    };
};
