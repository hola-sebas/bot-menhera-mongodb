import Discord from 'discord.js';
import { bot_commands, permissions } from '../../@types/bot-commands';
import guild from '../../models/guild';

export default new class command_prefix implements bot_commands {
    name = 'prefix';
    description = 'Selecciona el prefijo de tu preferencia';
    usage = 'prefix <prefijo>';
    aliases = ['setprefix', 'setprefijo', 'prefijo'];
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL'];
    authorPermissions: permissions[] = ["ADMINISTRATOR", "MANAGE_MESSAGES", "MANAGE_CHANNELS"];
    category = __dirname.split(require('path').sep).pop();
    disable = false;

    execute = async function (message: Discord.Message, args: string[]): Promise<void> {
        let prefix = await guild.findOne({ guildId: message.guild?.id });
        if (!prefix) return;
        let newprefix = args[0];
        if (!newprefix) {
            message.channel.send('Debes poner un prefix!');
            return;
        }
        if (newprefix.length > 3) {
            message.channel.send('No puedes poner un prefijo mayor a 3 caracteres');
            return;
        }
        prefix.configuracion.prefix = newprefix;
        prefix.save();
        message.channel.send(`ok ahora mi nuevo prefix va a ser ${newprefix}`);
    };
};
