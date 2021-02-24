import Discord from 'discord.js';
import os from "os";
import { bot_commands, permissions } from "../../@types/bot-commands";
import IClient from "../../@types/discord-client";

import moment from "moment";
import "moment-duration-format";

var version = require('../../../package.json');

export default new class command_stats implements bot_commands {
    name = 'stats';
    description = 'Muestra mis estadisticas';
    usage = 'stats';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    execute = function (message: Discord.Message, args: string[], client: IClient): void {
        let dueño = client.users.cache.find(u => u.id === "355824156127920148");
        if (!dueño) {
            message.channel.send("hmm hay algo raro por aqui, no logro encontrar mi dueño T-T");
            return;
        };

        const actividad = moment.duration(client.uptime).format("D [dias], H [hrs], m [mins], s [secs]");
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setThumbnail(client.user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setTitle(`Estadisticas de ${client.user.username}`)
            .addField(`Dueño: `, `\`\`\`${dueño.tag} (${dueño.id})\`\`\``)
            .addField(`Canales: `, `\`\`\`${client.channels.cache.size}\`\`\``, true)
            .addField(`Servidores: `, `\`\`\`${client.guilds.cache.size}\`\`\``, true)
            .addField(`Usuarios: `, `\`\`\`${client.users.cache.size}\`\`\``, true)
            .addField(`Version: `, `\`\`\`${version.version}\`\`\``, true)
            .addField(`libreria: `, `\`\`\`discord.js ${version.dependencies["discord.js"]}\`\`\``, true)
            .addField(`Uptime: `, `\`\`\`css\n${actividad}\`\`\``)
            .addField(`Cpu: `, `\`\`\`${os.cpus().map(m => m.model).shift()} (${os.arch()})\`\`\``)
            .addField(`Uso de cpu: `, `\`\`\`${(process.cpuUsage().user / 1000 / 1000).toFixed(2)} %\`\`\``, true)
            .addField(`Ram: `, `\`\`\`${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB / ${(os.totalmem() / 1073741824).toFixed(0)} GB\`\`\``, true);

        message.channel.send(embed);
        return;
    };
};
