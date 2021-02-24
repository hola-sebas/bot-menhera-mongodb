import discord, { Message } from 'discord.js';
import notificationsdb from '../../models/notifications';
import { bot_commands, permissions } from '../../@types/bot-commands';
import IClient from '../../@types/discord-client';
import interfaceGuildModel from '../../@types/mongo/guild-model';
const version = require('../../../package.json');

export default new class command_help implements bot_commands {
    name = 'help';
    description = 'Para obtener ayuda sobre los comandos';
    usage = 'help';
    aliases = ["ayuda"];
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = false;

    execute = async (message: Message, args: string[], client: IClient, guildDatabase: interfaceGuildModel) => {
        const carpetas = client.categories;
        let argumentos = args[0] ? args[0].toLowerCase() : "______";

        const command = client.commands.get(argumentos)
            || client.commands.find((cmd) => cmd.aliases?.includes(argumentos) || false);

        if (!args.length) {
            var stringcategories: string = "";
            carpetas.forEach((category, key) => {
                stringcategories = `${stringcategories}\n\`${guildDatabase.config.prefix}help ${key}\` ║ ${category.description}`;
            });
            const embed = new discord.MessageEmbed()
                .setTitle(`Comados de ${client.user.username}`)
                .setDescription(`Ahora mismo hay \`${carpetas.size}\` categorias y \`${client.commands.size.toString()}\` comandos para ti\n`)
                .setColor('RANDOM')
                .addField('• Categorias', stringcategories)
                .addField('• Enlaces útiles:', ['[Donaciones](https://ko-fi.com/dannypalma) ',
                    '║ [Nueva! Dashboard](https://menherachan.herokuapp.com)',
                    '║ [Soporte](https://discord.gg/S8NJ7j7VvA)',
                    '║ [Invitame](https://discord.com/oauth2/authorize?client_id=732398026878091284&scope=bot&permissions=8)'].join(""))
                .setFooter(`${client.user.username} version ${version.version}`, client.user.displayAvatarURL())
                .setThumbnail('https://cdn.discordapp.com/attachments/736287295522603098/742490666692509776/274-2748314_freetoedit-menherachan-animegirl-animecute-png-kawaii-anime-girl.png');
            let notificacion = (await notificationsdb.find())[0];
            if (notificacion) {
                embed.addField(notificacion.title, `${notificacion.notification_body}\n\n\`${notificacion.date.toUTCString()}\``);
            };
            message.channel.send(embed);
            return;
        }

        if (!command) {
            if (!carpetas.has(argumentos)) return;
            const comandos = client.commands.filter((value) => value.category === argumentos);
            const detalles = new discord.MessageEmbed()
                .setTitle(`Categoria ${argumentos}, encontré ${comandos.size} comandos`)
                .setDescription(`Para obtener ayuda más detallada sobre un comando utiliza \`${guildDatabase.config.prefix}help[comando]\``)
                .setThumbnail('https://cdn.discordapp.com/attachments/736287295522603098/742490666692509776/274-2748314_freetoedit-menherachan-animegirl-animecute-png-kawaii-anime-girl.png')
                .setColor('RANDOM')
                .setFooter(`${client.user.username} version ${version.version}`, client.user.displayAvatarURL());
            if (!comandos.size) {
                detalles.addField('• Comandos', 'No hay comandos en esta categoria');
            } else {
                detalles.addField('• Comandos', comandos.map(comando => {
                    return `\`\`\`md\n• ${guildDatabase.config.prefix}${comando.name}\n• ${comando.description}\n\`\`\``;
                }).join(' '));
            };
            message.channel.send(detalles);
            return;
        } else {
            const comando = new discord.MessageEmbed()
                .setTitle(`Acerca de el comando ${command.name.charAt(0).toUpperCase() + command.name.substr(1)}`)
                .addField(`• Nombre: `, `${command.name.charAt(0).toUpperCase() + command.name.substr(1)}`)
                .addField(`• Descripcion: `, command.description)
                .addField(`• Uso: `, `\`\`\`md\n${guildDatabase.config.prefix}${command.usage}\`\`\``)
                .setColor('RANDOM')
                .setFooter(`Consultado por: ${message.author.username} • Syntaxis: <requerido> (opcional) a | b`, message.author.displayAvatarURL())
                .setThumbnail('https://cdn.discordapp.com/attachments/736287295522603098/742490666692509776/274-2748314_freetoedit-menherachan-animegirl-animecute-png-kawaii-anime-girl.png');

            if (command.aliases) {
                comando.addField(`• Apodos:`, command.aliases.map(aliase => {
                    return `\`${guildDatabase.config.prefix}${aliase}\``;
                }));
            }
            comando.addField(`• Permisos: `, `\`\`\`${command.permissions.join(', ')}\`\`\``);
            message.channel.send(comando);
        }
    };
};
