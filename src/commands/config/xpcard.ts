import render from '../../modules/images/rank';
import regex from 'hex-color-regex';
import userdb from '../../models/user';
import discord from "discord.js";
import { bot_commands, permissions } from '../../@types/bot-commands';

export default new class command_xpcard implements bot_commands {
    name = 'xpcard';
    description = 'Configura la imagen de fondo de tu tarjeta de xp y tambien el color (opcional)';
    usage = 'xpcard <link> (color)';
    category = __dirname.split(require('path').sep).pop();
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'];
    disable = false;
    cooldown = 10;

    execute = async function (message: discord.Message, args: string[]): Promise<void> {
        let url = args[0];
        let argsColor = args[1] || '#cd5c5c';
        if (!url) {
            message.channel.send('Debes poner el link de la imagen que quieres de fondo');
            return;
        }
        let user = message.author;
        let config = await userdb.findOne({ userID: user.id });
        if (!config) return;
        let color = config.xp.color;
        let level = config.xp.nivel;
        let currentXP = config.xp.actual;
        let needXP = config.xp.necesario;
        try {
            if (regex().test(argsColor)) {
                config.xp.color = argsColor;
                color = config.xp.color;
            }
            let img = await render.run(user, color, level.toString(), currentXP, needXP, url);
            message.channel.send('Ok este seria un ejemplo de tu tarjeta de xp', { files: [img] });
            config.xp.url = url;
            config.save();

        } catch (err) {
            message.channel.send(err.toString());
        }
    };
};
