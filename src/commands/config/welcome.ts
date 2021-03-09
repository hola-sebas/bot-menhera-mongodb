import Discord from "discord.js";
import { bot_commands, permissions } from "../../@types/bot-commands";
import IClient from "../../@types/discord-client";
import interfaceGuildModel from "../../@types/mongo/guild-model";
import guild from '../../models/guild';
import renderCard from "../../modules/images/card";

export default new class command_welcome implements bot_commands {
    name = 'welcome';
    description = 'Configura las bienvenidas';
    usage = 'welcome < card / channel o chnl / message o msg >';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES'];
    authorPermissions: permissions[] = ["ADMINISTRATOR", "MANAGE_CHANNELS"];
    category = __dirname.split(require('path').sep).pop();
    disable = false;

    async execute(message: Discord.Message, args: string[], _client: IClient, guildDatabase: interfaceGuildModel): Promise<void> {
        if (!message.member?.permissions.has('ADMINISTRATOR')) {
            message.channel.send('No tienes permisos para ejecutar este comando');
            return;
        }
        if (!args[0]) {
            message.channel.send('Debes especificar una accion a realizar asi <card / channel / message>');
            return;
        };
        switch (args[0]) {
            case 'card':
                let linkURL = args[1];
                let linkAttachment = message.attachments.first()?.url || "";

                if (!linkAttachment && !linkURL) {
                    message.channel.send('Debes poner el link de una imagen o adjuntar una en tu mensaje');
                    return;
                }
                if (linkAttachment && linkURL) {
                    message.channel.send('Solo puedes poner 1 opcion escribir una url o adjuntar el archivo');
                    return;
                }
                message.channel.startTyping();
                try {
                    let img = await renderCard.run(message.author, linkURL || linkAttachment, guildDatabase.messages.welcome.message);
                    message.channel.stopTyping(true);
                    guildDatabase.messages.welcome.img = linkURL || linkAttachment;
                    await guildDatabase.save();
                    message.channel.send('Ok este seria un ejemplo de tu tarjeta de bienvenida', { files: [img] });
                } catch (err) {
                    message.channel.stopTyping(true);
                    message.channel.send(`${err}`);
                    return;
                }
                break;

            case 'chnl':
            case 'channel':
                if (args[1] == 'del') {
                    let ok = guildDatabase.messages.welcome.channel;
                    if (ok == "0") {
                        message.channel.send('El canal de bienvenidas ya esta desabilitado');
                        return;
                    }
                    guildDatabase.messages.welcome.channel = '0';
                    await guildDatabase.save();
                    message.channel.send('Ok desabilite el canal de bienvenidas');
                    return;
                }
                let canal = message.mentions.channels.first();
                if (!canal) {
                    message.channel.send('Debes mencionar un canal');
                    return;
                }
                if (!message.guild?.me?.permissionsIn(canal).has(['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'])) {
                    message.channel.send('No tengo permisos en ese canal');
                    return;
                }
                guildDatabase.messages.welcome.channel = canal.id;
                await guildDatabase.save();
                message.channel.send(`Ok ahora el canal de bienvenidas es <#${canal.id}>`);
                break;

            case 'msg':
            case 'message':
                let mensaje = args.slice(1).join(' ');
                if (!mensaje.length) {
                    message.channel.send('Debes poner un mensaje de bienvenida, puedes usar <{member} / @{member}, {guild} y {membercount}>');
                    return;
                }
                if (mensaje == 'del') {
                    guildDatabase.messages.welcome.message = 'Bienvenido al server!';
                    await guildDatabase.save();
                    message.channel.send('Ok reestablecí el mansaje de bienvenida a \nBienvenido al server!');
                    return;
                }
                guildDatabase.messages.welcome.message = mensaje;
                await guildDatabase.save();
                let regex = /@{member}/g;
                let regex1 = /{member}/g;
                if (regex.test(mensaje)) {
                    mensaje = mensaje.replace(regex, `<@${message.author.id}>`);
                } else if (regex1.test(mensaje)) {

                    mensaje = mensaje.replace(regex1, message.author.username);
                }
                mensaje = mensaje.replace(/{guild}/g, message.guild?.name || "* Inserte servidor aqui *");
                mensaje = mensaje.replace(/{membercount}/g, message.guild?.memberCount.toString() || "23");
                const embed = new Discord.MessageEmbed()
                    .setTitle('Ok aqui esta un ejemplo del mensaje de bienvenida: ')
                    .setDescription(`${mensaje}`)
                    .setColor('RANDOM');
                message.channel.send(embed);
                break;

            default:
                message.channel.send('Esa accion no existe\nDebes especificar una accion a realizar asi <card / channel / message>');
                break;
        }
    };
};
