import { Message } from "discord.js";
import { musicManager } from ".";
import { bot_commands, permissions } from "../../@types/bot-commands";

export default new class command_resume implements bot_commands {
    name = "skip";
    category = __dirname.split(require('path').sep).pop();
    aliases = ["saltar"];
    cooldown = 10;
    description = "Salta la cancion actual";
    disable = true;
    permissions: permissions[] = ["VIEW_CHANNEL", "SEND_MESSAGES"];
    usage = "skip";
    execute(message: Message) {
        var queueInfo = musicManager.guilds.get(message.guild?.id || "");
        if (!queueInfo) {
            message.channel.send("No hay cola de reproduccion en este servidor");
            return;
        }
        if (queueInfo.Text_Channel.id !== message.channel.id) {
            message.channel.send(`Este comando esta desabilitado en este canal mientras haya cola de reproduccion en el servidor, por favor usalo en <#${queueInfo.Text_Channel.id}>`);
            return false;
        }
        queueInfo.nextSong();
    }
};
