import sh from 'chalk';
import readline from 'readline';
import Discord, { Message } from 'discord.js';

import userDB from '../models/user';
import configJSON from '../config';
import guild from '../models/guild';
import IClient from '../@types/discord-client';
import module_GuildDB from "../modules/GuildDatabase";
import module_MemberDB from "../modules/MemberDatabase";
import module_AutoURL from "../modules/msg/autoURL";
import module_autoReply from "../modules/msg/autoreply";
import module_memberXP from "../modules/msg/memberXp";
import module_mencion from "../modules/msg/mencion";


const cooldowns = new Discord.Collection<string, Map<string, Date>>();


export default new class event_message {
    name = 'message';
    run = async function (client: IClient, message: Message): Promise<void> {
        if (!message.guild || message.author.bot) return;
        if (!message.guild.me?.permissionsIn(message.channel).has('SEND_MESSAGES')) {
            if (message.member?.permissions.has('ADMINISTRATOR')) {
                message.author.send('Para poder usarme en ese canal debes darme permisos de enviar mensajes').catch(err => err)
                return;
            }
        }
        let prefix = configJSON.prefix

        //ejecucion de modulos
        await module_GuildDB(message, client);
        await module_MemberDB(message, client);

        await module_AutoURL.run(message);
        await module_autoReply.run(message);
        await module_memberXP.run(message);
        await module_mencion.run(message, client);
        //fin de ejecucion de modulos

        // verificar el registro de la base de datos
        let usuario = await userDB.findOne({ userId: message.author.id })
        if (!usuario) return
        let configuracion = await guild.findOne({ guildId: message.guild.id })
        if (!configuracion) return
        prefix = configuracion.configuracion.prefix

        if (!message.content.startsWith(prefix)) return;
        // fin de la verificacion

        // si el contenido es solo el prefix
        if (message.content == prefix) {
            const embedPrefix = new Discord.MessageEmbed()
                .setDescription(`Veo que no pusiste ningun comando, puedes empezar con ${prefix}help`)
                .setColor(0xf1c40f);
            message.channel.send(embedPrefix).catch(err => err)
            return
        }
        // fin solo prefix

        //manejo de comandos
        const args = message.content.slice(prefix.length).trim().split(" ");
        const commandName = args.shift()?.toLowerCase() || "";

        let disabled_commands = configuracion.configuracion.comandosDesactivados
        let disabled_categories = configuracion.configuracion.categoriasDesactivadas

        const command = client.commands.get(commandName)
            || client.commands.find((cmd) => cmd.aliases?.includes(commandName) || false);

        if (!command) return;

        if (disabled_categories.includes(command.category || "")) {
            if (process.env.NODE_ENV != "production") message.channel.send(`La categoria ${command.category} esta desactivada`);
            return;
        }
        if (disabled_commands.includes(command.name)) {
            if (process.env.NODE_ENV != "production") message.channel.send(`El comando ${command.name} esta desactivado`);
            return;
        }

        if (!message.guild.me?.permissionsIn(message.channel).has(command.permissions)) {
            message.channel.send(`No tengo los permisos necesarios para ejecutar ese comando, los permisos son: \n\`${command.permissions.join(', ')}\``)
            return
        }
        //fin manejo de comandos

        //Cooldowns

        var now: Date = new Date();
        if (cooldowns.get(message.author.id)?.has(command.name)) {
            let cooling = cooldowns.get(message.author.id)?.get(command.name);
            if (!cooling) return;
            var timeLeft = now.getDate() - cooling.getDate() / 10000;
            let tiempo = 'segundos';
            if (timeLeft > 60) {
                timeLeft = timeLeft / 60
                tiempo = 'minutos'
                if (timeLeft > 60) {
                    timeLeft = timeLeft / 60
                    tiempo = 'horas'
                    if (timeLeft > 60) {
                        timeLeft = timeLeft / 24
                        tiempo = 'dias'
                    }
                }
            }
            message.channel.send(`Por favor espera ${timeLeft.toFixed(1)} ${tiempo} para volver a ejecutar el comando ${command.name}`);
            return;
        };

        var user = cooldowns.get(message.author.id);
        if (!user) {
            cooldowns.set(message.author.id, new Map().set(command.name, new Date()));
        } else {
            user.set(command.name, new Date());
        };

        setTimeout(() => {
            let user = cooldowns.get(message.author.id);
            user?.delete(command.name);
            if (!user?.size) cooldowns.delete(message.author.id);
        }, command.cooldown || 5000);

        //Fin de coodowns

        //ejecucion de comandos
        try {

            readline.cursorTo(process.stdout, 0);
            process.stdout.write(sh.yellow(`Ejecutando el comando ${command.name} en ${message.guild.name}\n`));
            await command.execute(message, args, client, prefix);

            setTimeout(() => {
                process.stdout.write("->")
            }, 50)

        } catch (err) {

            readline.cursorTo(process.stdout, 0);
            console.error("Hubo un error durante la ejecucion el error se mostrará a continuación: \n", err);
            process.stdout.write('->')

            var sad = [
                "https://gluc.mx/u/fotografias/m/2019/12/30/f608x342-21614_51337_0.png",
                "https://media3.giphy.com/media/Xqlsn2kLPBquI/giphy.gif",
                "https://media1.tenor.com/images/0b796a2198f36cdb21c4357592a10ecf/tenor.gif?itemid=12913371",
                "https://i.pinimg.com/originals/73/b1/3b/73b13bcd2590cd93ca1ca9bbc7f917be.gif",
                "https://64.media.tumblr.com/0e42f221a783ae10e79fd8c710b59898/tumblr_o1usx7DyI91s7fey2o1_500.gif"
            ]
            const embed_error = new Discord.MessageEmbed()
                .setTitle("oh no! D:")
                .setImage(sad[(Math.floor(Math.random() * sad.length))])
                .setDescription("hubo un error al intentar ajecutar el comando, por favor espera y vuelve a intentarlo")
                .setColor("RANDOM")
                .setFooter(`Comando ejecutado por: ${message.author.username}`, message.author.displayAvatarURL())
                .setTimestamp();

            message.channel.send(embed_error).then(m => m.delete({ timeout: 10000 })).catch(err => err);
        }
        //fin de ejecucion de comandos

    }
}
