import guild from '../../models/guild';
import Discord from 'discord.js';
import { bot_commands, permissions } from "../../@types/bot-commands";
import interfaceGuildModel from '../../@types/mongo/guild-model';
import IClient from '../../@types/discord-client';

export default new class command_goodbye implements bot_commands {
    name = 'goodbye';
    description = 'Configura las despedidas';
    usage = 'goodbye < channel o chnl / message o msg >';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    authorPermissions: permissions[] = ["ADMINISTRATOR", "MANAGE_CHANNELS"];
    category = __dirname.split(require('path').sep).pop();
    disable = false;

    async execute(message: Discord.Message, args: string[], _client: IClient, guildDatabase: interfaceGuildModel): Promise<void> {
        if (!args[0]) {
            message.channel.send('Debes especificar una accion a realizar con \`channel o chnl\` y \`message o msg\`');
            return;
        };
        switch (args[0]) {
            case 'chnl':
            case 'channel':
                if (!args[1]) {
                    message.channel.send('debes mencionar un canal o escribir \`0\` para desactivarlo\`');
                    return;
                }
                if (args[1] == '0') {
                    guildDatabase.messages.goodbye.channel = "0";
                    await guildDatabase.save();
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
                guildDatabase.messages.goodbye.channel = canal.id;
                await guildDatabase.save();
                message.channel.send(`Ok ahora el canal de despedidas es <#${canal.id}>`);
                break;
            case 'msg':
            case 'message':
                if (!args[1]) {
                    message.channel.send('Debes poner un mensaje de bienvenida\npuedes usar \`{user}\` \`{guild}\` \`{membercount}\`');
                    return;
                }
                if (args[1] == 'del') {
                    guildDatabase.messages.goodbye.message = '{user} Se fue de el server';
                    await guildDatabase.save();
                    message.channel.send(`Ok reestableci el mensaje de despedidas a \n{user} Se fue de el server`);
                    return;
                }
                let mensaje = args.slice(1).join(' ');
                guildDatabase.messages.goodbye.message = mensaje;
                await guildDatabase.save();
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
