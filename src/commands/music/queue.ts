import { Message, MessageEmbed } from "discord.js";
import { musicManager } from "./index";
import { bot_commands, permissions } from "../../@types/bot-commands";
import { YouTubeSearchResults } from "youtube-search";

export default new class command_queue implements bot_commands {
    name = "queue";
    aliases = ["cola"];
    category = __dirname.split(require('path').sep).pop();
    cooldown = 10;
    description = "Mira la cola de reproduccion actual";
    disable = true;
    permissions: permissions[] = ["VIEW_CHANNEL", "SEND_MESSAGES"];
    usage = "queue <pagina>";
    execute(message: Message, args: string[]) {
        var queueInfo = musicManager.guilds.get(message.guild?.id || "");
        if (!queueInfo || !queueInfo.queue.length) {
            message.channel.send("No hay cola de reproduccion en este servidor");
            return false;
        }
        if (queueInfo.Text_Channel.id !== message.channel.id) {
            message.channel.send(`Este comando esta desabilitado en este canal mientras haya cola de reproduccion en el servidor, por favor usalo en <#${queueInfo.Text_Channel.id}>`);
            return false;
        }
        var page = args[0] ? parseInt(args[0]) : 0;

        let queueArray = queueInfo.queue;
        let queuePageArray: Array<YouTubeSearchResults[]> = [];
        const LONGITUD_PEDAZOS = 5;
        for (let i = 0; i < queueArray.length; i += LONGITUD_PEDAZOS) {
            let pedazo = queueArray.slice(i, i + LONGITUD_PEDAZOS);
            queuePageArray.push(pedazo);
        }
        if (page > queuePageArray.length) {
            message.channel.send(`La pagina ${page} no existe...`);
            return;
        }
        var queueInfoEmbed = new MessageEmbed()
            .setTitle(`Cola de reproduccion del servidor: ${message.guild?.name}`)
            .addFields(queuePageArray[page].map((value, index) => {
                return {
                    name: `${index}. ${value.title}`,
                    value: value.description || "No description..."
                };
            }))
            .setFooter(`Pagina: ${page} de ${queueArray.length}`)
            .setColor("RANDOM");
        message.channel.send(queueInfoEmbed);
    }
};
