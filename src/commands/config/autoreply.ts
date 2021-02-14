import { bot_commands, permissions } from '../../@types/bot-commands';
import guild from '../../models/guild';
import Discord from "discord.js";

export default new class command_autoreply implements bot_commands {
    name = 'autoreply';
    description = 'Configura si deseas que responda a mensajes automaticamente';
    usage = 'autoreply';
    aliases = ['reply'];
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL'];
    authorPermissions: permissions[] = ["ADMINISTRATOR"];
    category = __dirname.split(require('path').sep).pop();
    disable = false;
    cooldown = 5;

    execute = async function (message: Discord.Message, args: string[]): Promise<void> {
        let config = await guild.findOne({ guildID: message.guild?.id });
        if (!config) return;
        let activado = config.messages.autoReply;
        if (activado == undefined || activado == true) {
            config.messages.autoReply = false;
            config.save();
            message.channel.send('Ok **Desactive** la respuesta automatica a mensajes');
        } else if (activado == false) {
            config.messages.autoReply = true;
            config.save();
            message.channel.send('Ok **Active** la respuesta automatica a mensajes');
        };
    };
};
