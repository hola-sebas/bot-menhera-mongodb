import Discord, { Message } from 'discord.js';
import { bot_commands, permissions } from '../../@types/bot-commands';
import IClient from '../../@types/discord-client';

export default new class command_say implements bot_commands {
    name = 'say';
    description = 'Dime que tengo que decir';
    usage = 'say (canal) <mensaje>';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS', 'MANAGE_MESSAGES'];
    authorPermissions: permissions[] = ["ADMINISTRATOR"];
    category = __dirname.split(require('path').sep).pop();
    disable = true;

    execute = function (message: Message, args: string[], client: IClient, prefix: string): void {
        let canal = message.mentions.channels.first();
        if (!canal) {
            let mensaje = args.slice(0).join(" ");
            if (!mensaje.length) {
                message.channel.send('Debes poner un mensaje para que yo escriba!');
                return;
            }
            message.channel.send(mensaje).catch(err => err);
            return;
        }
        let noMencion = args[0];
        if (noMencion.indexOf('<') == -1 && noMencion.indexOf('>') == -1 && noMencion.indexOf('#') == -1) {
            message.channel.send(`Debes poner el canal al principio!\nEjemplo: \`${prefix}say #canal hola\``)
                .then(m => m.delete({ timeout: 10000 }));
            return;
        }
        let mensaje = args.slice(1).join(" ");
        if (!mensaje.length) {
            message.channel.send('Debes poner un mensaje para que yo escriba!');
            return;
        }
        let buscar = message.guild?.channels.cache.find(c => c.name == canal?.name && c.type == "text");
        if (!buscar?.members.find((value) => value.id == client.user.id)?.permissions.has(['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'])) {
            message.channel.send('No tengo permisos para enviar mensajes en ese canal <:aquacry:735880078675673168>')
                .then(m => m.delete({ timeout: 5000 }));
            return;
        }
        if (!message.guild?.me?.permissionsIn(message.channel).has('ADD_REACTIONS')) {
            message.channel.send('Primero dame permisos para añadir reacciones <:aquacry:735880078675673168>')
                .then(m => m.delete({ timeout: 5000 }));
            return;
        }

        message.channel.send(`Lo quieres en un embed?`).then(msg => {
            msg.react('✅');
            msg.react('❌');
            const filtro = (reaction: Discord.MessageReaction, user: Discord.User) => {
                return ["✅", "❌"].includes(reaction.emoji.name) && user.id === message.author.id;
            };
            msg.awaitReactions(filtro, { max: 1, time: 30000, errors: ["time"] }).catch(() => {
                msg.delete();
                message.channel.send('No tomaste una eleccion <:aquacry:735880078675673168>').then(m => m.delete({ timeout: 5000 }));
            }).then(coleccionado => {
                if (!coleccionado) return;
                const reaccion = coleccionado.first();
                if (reaccion?.emoji.name == "✅") {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(mensaje)
                        .setColor(0x33acdd);
                    msg.delete();
                    canal?.send(embed);
                    message.channel.send("Listo!").then(l => l.delete({ timeout: 5000 }));
                } else if (reaccion?.emoji.name == "❌") {
                    msg.delete();
                    canal?.send(mensaje);
                    message.channel.send("Listo!").then(l => l.delete({ timeout: 5000 }));
                }
            });
        });
    };
};
