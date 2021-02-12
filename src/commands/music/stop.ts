import { Message } from "discord.js";
import { musicManager } from ".";
import { bot_commands, permissions } from "../../@types/bot-commands";

export default new class command_resume implements bot_commands {
    name = "stop";
    category = __dirname.split(require('path').sep).pop();
    cooldown = 10;
    description = "Elimina toda la cola de reproduccion y me desconecto";
    disable = true;
    permissions: permissions[] = ["VIEW_CHANNEL", "SEND_MESSAGES"];
    usage = "stop";
    execute(message: Message) {
        var queueInfo = musicManager.guilds.get(message.guild?.id || "");
        if (!queueInfo) {
            message.channel.send("No hay cola de reproduccion en este servidor");
            return;
        }
        queueInfo.voice_connection?.disconnect();
    }
};
