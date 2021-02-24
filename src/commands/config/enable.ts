import guild from '../../models/guild';
import { bot_commands, permissions } from "../../@types/bot-commands";
import IClient from "../../@types/discord-client";
import discord from "discord.js";
import interfaceGuildModel from '../../@types/mongo/guild-model';


export default new class command_enable implements bot_commands {
    name = 'enable';
    description = 'Activa un comado o categoria que ya este desabilitado';
    usage = 'enable < -c(categoria) / -co(comando) > <nombre>';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL'];
    authorPermissions: permissions[] = ["ADMINISTRATOR"];
    category = __dirname.split(require('path').sep).pop();
    disable = false;
    cooldown = 5;

    async execute(message: discord.Message, args: string[], client: IClient, guildDatabase: interfaceGuildModel): Promise<void> {
        let comandos = guildDatabase.config.disabledCommands;
        let categorias = guildDatabase.config.disabledCategories;
        let opcion = args[0];
        let argumentos = args[1];

        if (opcion == '-c') {
            if (!argumentos) {
                message.channel.send('Debes poner una categoria a activar');
                return;
            }
            if (!client.categories.has(argumentos)) {
                message.channel.send('Esa categoria no existe');
                return;
            }
            if (categorias.includes(argumentos)) {
                let indexcategoria = guildDatabase.config.disabledCategories.findIndex(i => i == argumentos);
                guildDatabase.config.disabledCategories.splice(indexcategoria);
                await guildDatabase.save();
                message.channel.send(`Ok habilite la categoria ${argumentos}`);
                return;
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
                message.channel.send('Ese comando no existe');
                return;
            }
            if (comandos.includes(command.name)) {
                let indexcomand = guildDatabase.config.disabledCommands.findIndex(i => i == command.name);
                guildDatabase.config.disabledCommands.splice(indexcomand);
                await guildDatabase.save();
                message.channel.send(`Ok habilite el comando ${argumentos}`);
                return;
            } else {
                message.channel.send('Ese comando ya esta activado');
                return;
            }
        } else {
            message.channel.send('Necesitas poner una opcion a desactivar asi [-c categoria || -co comando]');
            return;
        }
    };
};
