import render from '../../modules/images/rank';
import regex from 'hex-color-regex';
import discord from "discord.js";
import { bot_commands, permissions } from '../../@types/bot-commands';
import interfaceGuildModel from '../../@types/mongo/guild-model';
import interfaceUserModel from '../../@types/mongo/user-model';
import IClient from '../../@types/discord-client';

export default new class command_xpcard implements bot_commands {
    name = 'xpcard';
    description = 'Configura la imagen de fondo de tu tarjeta de xp y tambien el color (opcional)';
    usage = 'xpcard <link> (color)';
    category = __dirname.split(require('path').sep).pop();
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'];
    disable = false;
    cooldown = 10;

    async execute(message: discord.Message, args: string[], _client: IClient, _guildDatabase: interfaceGuildModel, memberDatabase: interfaceUserModel): Promise<void> {
        let url = args[0];
        let argsColor = args[1] || '#cd5c5c';
        if (!url) {
            message.channel.send('Debes poner el link de la imagen que quieres de fondo');
            return;
        }
        let color = memberDatabase.xp.color;
        let level = memberDatabase.xp.nivel;
        let currentXP = memberDatabase.xp.actual;
        let needXP = memberDatabase.xp.necesario;
        try {
            if (regex().test(argsColor)) {
                memberDatabase.xp.color = argsColor;
                color = memberDatabase.xp.color;
            }
            let img = await render.run(message.author, color, level.toString(), currentXP, needXP, url);
            message.channel.send('Ok este seria un ejemplo de tu tarjeta de xp', { files: [img] });
            memberDatabase.xp.url = url;
            await memberDatabase.save();

        } catch (err) {
            message.channel.send(err.toString());
        }
    };
};
