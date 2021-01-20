import render from '../../modules/images/rank';
import userdb from '../../models/user';
import { bot_commands, permissions } from '../../@types/bot-commands';
import { Message } from 'discord.js';
import IClient from '../../@types/discord-client';

export default new class command_xp implements bot_commands {
    name = 'xp';
    description = 'Muestra tu xp actual o de otro usuario';
    usage = 'xp (mencion)';
    category = __dirname.split(require('path').sep).pop();
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'];
    disable = true;
    cooldown = 30;
    execute = async function (message: Message, args: string[], client: IClient): Promise<void> {
        message.channel.startTyping()
        let user = message.mentions.users.first() || message.author
        if (user.id == client.user.id) {
            message.channel.send('Esa soy yo!\nTengo un nivel I N F I N I T O (⌐■_■)');
            return;
        }
        let config = await userdb.findOne({ userId: user.id })
        if (!config) {
            message.channel.send('hmm no tengo datos de ese usuario');
            return;
        }
        let level = config.xp.nivel
        let curXp = config.xp.actual
        let needXP = config.xp.necesario
        let color = config.xp.color
        let url = config.xp.url
        try {
            let img = await render.run(user, color, level, curXp, needXP, url)
            if (!img) throw 'No se ha podido renderizar la terjeta de xp por favor ejecuta xpcard y cambia la imagen de fondo';
            message.channel.send({ files: [img] })
            message.channel.stopTyping()
        } catch (err) {
            message.channel.send(err)
            message.channel.stopTyping()
        }
    }
}   
