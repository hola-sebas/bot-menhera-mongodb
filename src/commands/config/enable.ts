import guild from '../../models/guild';
import { bot_commands, permissions } from "../../@types/bot-commands";
import IClient from "../../@types/discord-client";
import discord from "discord.js";


export default new class command_enable implements bot_commands {
    name = 'enable';
    description = 'Activa un comado o categoria que ya este desabilitado';
    usage = 'enable < -c(categoria) / -co(comando) > <nombre>';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL'];
    category = __dirname.split(require('path').sep).pop();
    disable = false;
    cooldown = 5;

    execute = async function (message: discord.Message, args: string[], client: IClient): Promise<void> {
        if (!message.member?.permissions.has('ADMINISTRATOR')) {
            message.channel.send('No tienes los permisos para ejecutar este comando').then(m => m.delete({ timeout: 5000 }));
            return;
        }

        let config = await guild.findOne({ guildId: message.guild?.id })
        if (!config) return;
        let comandos = config.configuracion.comandosDesactivados;
        let categorias = config.configuracion.categoriasDesactivadas;
        let opcion = args[0];
        let argumentos = args[1];

        if (opcion == '-c') {
            if (!argumentos) {
                message.channel.send('Debes poner una categoria a activar')
                return
            }
            if (!client.categoria.has(argumentos)) {
                message.channel.send('Esa categoria no existe')
                return
            }
            if (categorias.includes(argumentos)) {
                let indexcategoria = config.configuracion.categoriasDesactivadas.findIndex(i => i == argumentos)
                config.configuracion.categoriasDesactivadas.splice(indexcategoria)
                config.save()
                message.channel.send(`Ok habilite la categoria ${argumentos}`)
                return
            } else {
                message.channel.send('Esa categoria ya esta activada');
                return;
            }
        } else if (opcion == '-co') {
            if (!argumentos) {
                message.channel.send('Debes poner un comando a activar');
                return;
            }
            const command = client.commands.get(argumentos)
                || client.commands.find((cmd) => cmd.aliases?.includes(argumentos) || false);

            if (!command) {
                message.channel.send('Ese comando no existe')
                return;
            }
            if (comandos.includes(command.name)) {
                let indexcomand = config.configuracion.comandosDesactivados.findIndex(i => i == command.name)
                config.configuracion.comandosDesactivados.splice(indexcomand)
                config.save()
                message.channel.send(`Ok habilite el comando ${argumentos}`)
                return;
            } else {
                message.channel.send('Ese comando ya esta activado');
                return;
            }
        } else {
            message.channel.send('Necesitas poner una opcion a desactivar asi [-c categoria || -co comando]');
            return;
        }
    }
}