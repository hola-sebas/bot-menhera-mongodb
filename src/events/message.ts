import sh from 'chalk';
import Discord, { Message } from 'discord.js';

import configJSON from '../config';
import IClient from '../@types/discord-client';
import module_GuildDB from "../modules/GuildDatabase";
import module_MemberDB from "../modules/MemberDatabase";
import module_AutoURL from "../modules/msg/autoURL";
import module_autoReply from "../modules/msg/autoreply";
import module_memberXP from "../modules/msg/memberXp";
import module_mencion from "../modules/msg/mencion";


const cooldowns = new Discord.Collection<string, Discord.Collection<string, Date>>();


export default new class event_message {
    name = 'message';
    run = async function (client: IClient, message: Message): Promise<void> {
        if (!message.guild || message.author.bot) return;
        if (!message.guild.me?.permissionsIn(message.channel).has('SEND_MESSAGES')) {
            if (message.member?.permissions.has('ADMINISTRATOR')) {
                message.author.send('Para poder usarme en ese canal debes darme permisos de enviar mensajes').catch(err => err);
                return;
            }
        }
        let prefix = configJSON.prefix;

        //ejecucion de modulos
        var guildDatabase = await module_GuildDB(message.guild.id);
        var memberDatabase = await module_MemberDB(message.guild.id);

        await module_AutoURL.run(message);
        await module_autoReply.run(message, guildDatabase);
        await module_memberXP.run(message, memberDatabase, guildDatabase);
        await module_mencion.run(message, client, guildDatabase);
        //fin de ejecucion de modulos

        // verificar el registro de la base de datos
        prefix = guildDatabase.config.prefix;

        if (!message.content.startsWith(prefix)) return;
        // fin de la verificacion

        // si el contenido es solo el prefix
        if (message.content == prefix) {
            const embedPrefix = new Discord.MessageEmbed()
                .setDescription(`Veo que no pusiste ningun comando, puedes empezar con ${prefix}help`)
                .setColor(0xf1c40f);
            message.channel.send(embedPrefix).catch(err => err);
            return;
        }
        // fin solo prefix

        //manejo de comandos
        const args = message.content.slice(prefix.length).trim().split(" ");
        const commandName = args.shift()?.toLowerCase() || "";

        let disabled_commands = guildDatabase.config.disabledCommands;
        let disabled_categories = guildDatabase.config.disabledCategories;

        const command = client.commands.get(commandName)
            || client.commands.find((cmd) => cmd.aliases?.includes(commandName) || false);

        if (!command) return;
        if (command.mantenceMode) {
            message.channel.send("este comando esta desactivado por motivos de mantenimiento por favor vuelve a intentarlo mas tarde");
            return;
        }

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
                .catch(() => void 0);
            return;
        }
        if (!message.member?.hasPermission(command.authorPermissions || [])) {
            message.channel.send(`lo siento pero no tienes los permisos necesarios, los permisos son: \n \`${command.authorPermissions?.join(", ")}\``);
        }
        //fin manejo de comandos

        //Cooldowns

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        var now: Date = new Date();
        var timestamps = cooldowns.get(command.name);
        var cooldownAmount = (command.cooldown || 5) * 1000;

        if (timestamps?.has(message.author.id)) {

            var expirationTime = (timestamps.get(message.author.id)?.getTime() || 5) + cooldownAmount;
            if (now.getTime() < expirationTime) {
                var timeLeft = (expirationTime - now.getTime()) / 1000;
                let timeName = 'segundos';
                if (timeLeft > 60) {
                    timeLeft = timeLeft / 60;
                    timeName = 'minutos';
                    if (timeLeft > 60) {
                        timeLeft = timeLeft / 60;
                        timeName = 'horas';
                        if (timeLeft > 60) {
                            timeLeft = timeLeft / 24;
                            timeName = 'dias';
                        }
                    }
                }
                message.channel.send(`Por favor espera ${timeLeft.toFixed(1)} ${timeName} para volver a ejecutar el comando ${command.name}`);
            }
            return;
        };
        timestamps?.set(message.author.id, now);
        setTimeout(() => {
            timestamps?.delete(message.author.id);
        }, cooldownAmount);
        //Fin de coodowns

        //ejecucion de comandos
        try {
            if (process.env.NODE_ENV != "production")
                console.log(sh.yellow(`Ejecutando el comando ${command.name} en ${message.guild.name}`));

            if (await command.execute(message, args, client, guildDatabase, memberDatabase) == false) {
                timestamps?.delete(message.author.id);
            };
        } catch (err) {

            console.error("There was an error during the command execution the error will be shown below: \n", err);

            var sad = [
                "https://gluc.mx/u/fotografias/m/2019/12/30/f608x342-21614_51337_0.png",
                "https://media3.giphy.com/media/Xqlsn2kLPBquI/giphy.gif",
                "https://media1.tenor.com/images/0b796a2198f36cdb21c4357592a10ecf/tenor.gif?itemid=12913371",
                "https://i.pinimg.com/originals/73/b1/3b/73b13bcd2590cd93ca1ca9bbc7f917be.gif",
                "https://64.media.tumblr.com/0e42f221a783ae10e79fd8c710b59898/tumblr_o1usx7DyI91s7fey2o1_500.gif"
            ];
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
    };
};
