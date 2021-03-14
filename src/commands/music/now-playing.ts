import { Message } from "discord.js";
import { musicManager } from "./index";
import { bot_commands, permissions } from "../../@types/bot-commands";

export default new class command_now_playing implements bot_commands {
    name = "nowplaying";
    description = "Muestra la cancion que se esta reproduciendo";
    aliases = ["np"];
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    permissions: permissions[] = ["VIEW_CHANNEL", "SEND_MESSAGES"];
    usage = "nowplaying";

    public execute(message: Message, args: string[]) {
        var queueInfo = musicManager.guilds.get(message.guild?.id || "");
        if (!queueInfo) {
            message.channel.send("No hay cola de reproduccion en este servidor");
            return;
        }
        if (!queueInfo.nowPlaying) {
            message.channel.send("No se esta reproduciendo algo en este servidor");
            return;
        }
        message.channel.send(`Ahora reproduciendo **${queueInfo.nowPlaying.title}**`);
    }
};
