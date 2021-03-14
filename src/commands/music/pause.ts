import { Message } from "discord.js";
import { bot_commands, permissions } from "../../@types/bot-commands";
import { musicManager } from "./index";

export default new class command_pause implements bot_commands {
    name = "pause";
    permissions: permissions[] = ["VIEW_CHANNEL", "SEND_MESSAGES"];
    usage = "pause";
    disable = true;
    aliases = ["pausar"];
    category = __dirname.split(require('path').sep).pop();
    description = "Pausa la cancion que se esta reproduciendo";
    execute(message: Message, args: string[]) {
        var queueInfo = musicManager.guilds.get(message.guild?.id || "");
        if (!queueInfo || !queueInfo.playing) {
            message.channel.send("No hay ninguna cancion en reproduccion");
            return;
        }
        if (queueInfo.Text_Channel.id !== message.channel.id) {
            message.channel.send(`Este comando esta desabilitado en este canal mientras haya cola de reproduccion en el servidor, por favor usalo en <#${queueInfo.Text_Channel.id}>`);
            return false;
        }
        queueInfo.playing = false;
        queueInfo.dispatchConnection?.pause();
        message.channel.send(`He pausado la reproduccion de: ${queueInfo.nowPlaying}`);
    }
};
