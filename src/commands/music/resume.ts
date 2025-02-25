import { Message } from "discord.js";
import { musicManager } from "./index";
import { bot_commands, permissions } from "../../@types/bot-commands";

export default new class command_resume implements bot_commands {
    name = "resume";
    category = __dirname.split(require('path').sep).pop();
    aliases = ["resumir"];
    cooldown = 10;
    description = "Resume la cancion actual que pausaste";
    disable = true;
    permissions: permissions[] = ["VIEW_CHANNEL", "SEND_MESSAGES"];
    usage = "resume";
    execute(message: Message) {
        var queueInfo = musicManager.guilds.get(message.guild?.id || "");
        if (!queueInfo) {
            message.channel.send("No hay canciones en reproduccion");
            return;
        }
        if (queueInfo.Text_Channel.id !== message.channel.id) {
            message.channel.send(`Este comando esta desabilitado en este canal mientras haya cola de reproduccion en el servidor, por favor usalo en <#${queueInfo.Text_Channel.id}>`);
            return false;
        }
        if (queueInfo.playing) {
            message.channel.send(`Ya se esta reproduciendo **${queueInfo.nowPlaying}**`);
            return;
        }
        queueInfo.playing = true;
        queueInfo.dispatchConnection?.resume();
        message.channel.send(`He resumido la reproduccion de: ${queueInfo.nowPlaying}`);
    }
};
