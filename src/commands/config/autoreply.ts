import { bot_commands, permissions } from '../../@types/bot-commands';
import guild from '../../models/guild';
import Discord from "discord.js";

export default new class command_autoreply implements bot_commands {
    name = 'autoreply';
    description = 'Configura si deseas que responda a mensajes automaticamente';
    usage = 'autoreply';
    aliases = ['reply'];
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL'];
    category = __dirname.split(require('path').sep).pop();
    disable = false;
    cooldown = 5;

    execute = async function (message: Discord.Message, args: string[]): Promise<void> {
        if (!message.member?.permissions.has('ADMINISTRATOR')) {
            message.channel.send('No tienes permisos para hacer eso ').then(m => m.delete({ timeout: 5000 }));
            return;
        };
        let config = await guild.findOne({ guildId: message.guild?.id });
        if (!config) return;
        let activado = config.mensajes.autoReply;
        if (activado == undefined || activado == true) {
            config.mensajes.autoReply = false;
            config.save();
            message.channel.send('Ok **Desactive** la respuesta automatica a mensajes');
        } else if (activado == false) {
            config.mensajes.autoReply = true;
            config.save();
            message.channel.send('Ok **Active** la respuesta automatica a mensajes');
        };
    }
}
