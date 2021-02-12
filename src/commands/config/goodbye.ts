import guild from '../../models/guild';
import Discord from 'discord.js';
import { bot_commands, permissions } from "../../@types/bot-commands";

export default new class command_goodbye implements bot_commands {
    name = 'goodbye';
    description = 'Configura las despedidas';
    usage = 'goodbye < channel o chnl / message o msg >';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    authorPermissions: permissions[] = ["ADMINISTRATOR", "MANAGE_CHANNELS"];
    category = __dirname.split(require('path').sep).pop();
    disable = false;

    execute = async function (message: Discord.Message, args: string[]): Promise<void> {
        if (!args[0]) {
            message.channel.send('Debes especificar una accion a realizar con \`channel o chnl\` y \`message o msg\`');
            return;
        };
        const config = await guild.findOne({ guildId: message.guild?.id });
        if (!config) return;
        switch (args[0]) {
            case 'chnl':
            case 'channel':
                if (!args[1]) {
                    message.channel.send('debes mencionar un canal o escribir \`del\` para desactivarlo\`');
                    return;
                }
                if (args[1] == 'del') {
                    config.mensajes.goodbye.channel = "0";
                    config.save();
                    message.channel.send('Ok desactive el canal de despedidas');
                    return;
                }
                let canal = message.mentions.channels.first();
                if (!canal) {
                    message.channel.send('Debes mencionar un canal!');
                    return;
                }
                if (!message.guild?.me?.permissionsIn(canal).has(['SEND_MESSAGES', 'VIEW_CHANNEL'])) {
                    message.channel.send('No tengo permisos para configurar ese canal como el de despedidas');
                    return;
                }
                config.mensajes.goodbye.channel = canal.id;
                config.save();
                message.channel.send(`Ok ahora el canal de despedidas es <#${canal.id}>`);
                break;
            case 'msg':
            case 'message':
                if (!args[1]) {
                    message.channel.send('Debes poner un mensaje de bienvenida\npuedes usar \`{user}\` \`{guild}\` \`{membercount}\`');
                    return;
                }
                if (args[1] == 'del') {
                    config.mensajes.goodbye.message = '{user} Se fue de el server';
                    config.save();
                    message.channel.send(`Ok reestableci el mensaje de despedidas a \n{user} Se fue de el server`);
                    return;
                }
                let mensaje = args.slice(1).join(' ');
                config.mensajes.goodbye.message = mensaje;
                config.save();
                let regexUser = /{user}/g;
                let regexGuild = /{guild}/g;
                let regexMemberCount = /{membercount}/g;
                mensaje = mensaje.replace(regexUser, message.author.tag)
                    .replace(regexGuild, message.guild?.name || "menhera chan")
                    .replace(regexMemberCount, message.guild?.memberCount.toString() || "18");
                const embed = new Discord.MessageEmbed()
                    .setTitle('Ok ahora el mensaje de despedida es:')
                    .setDescription(mensaje)
                    .setColor('RANDOM');
                message.channel.send(embed);
                break;
            default:
                message.channel.send('Esa accion no existe \nDebes especificar una accion a realizar con \`channel o chnl\` y \`message o msg\`');
                break;
        }
    };
};
