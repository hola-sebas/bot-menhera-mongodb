import Discord from 'discord.js';
import bugs from '../../models/bugs';
import { bot_commands, permissions } from "../../@types/bot-commands";

export default new class command_ping implements bot_commands {
    name = 'ping';
    description = 'Muestra el ping entre la API de Discord y el bot';
    usage = 'ping';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    execute = async function (message: Discord.Message, args: string[]): Promise<void> {
        let date1 = Date.now();
        await bugs.find();
        let date2 = Date.now();
        let ping = Math.round(message.client.ws.ping);
        const embed = new Discord.MessageEmbed()
            .setDescription(`🏓 Pong DiscordAPI: \`${ping} ms\`\n💾 Pong Base de datos: \`${date2 - date1} ms\``)
            .setColor("RANDOM");
        message.channel.send(embed);
        return;
    }
}
