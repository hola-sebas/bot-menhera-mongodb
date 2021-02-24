import guild from '../../models/guild';
import { bot_commands, permissions } from "../../@types/bot-commands";
import IClient from "../../@types/discord-client";
import discord from "discord.js";
import interfaceGuildModel from '../../@types/mongo/guild-model';

export default new class command_disable implements bot_commands {
    name = 'disable';
    description = 'Desabilita un comado o categoria';
    usage = 'disable < -c(categoria) / -co(comando)> <nombre>';
    aliases = ['dis'];
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL'];
    authorPermissions: permissions[] = ["ADMINISTRATOR"];
    category = __dirname.split(require('path').sep).pop();
    disable = false;
    cooldown = 5;
    mantenceMode = true;

    async execute(message: discord.Message, args: string[], client: IClient, guildDatabase: interfaceGuildModel): Promise<void> {
        switch (args[0]) {
            case '-co':
                if (!args[1]) {
                    message.channel.send('Debes poner un comando');
                    return;
                }
                let comando = args[1];
                const command = client.commands.get(comando)
                    || client.commands.find((cmd) => cmd.aliases?.includes(comando) || false);
                if (!command) return;
                let disables = guildDatabase.config.disabledCommands;

                if (disables.includes(command.name)) {
                    message.channel.send('El comando ya esta desactivado');
                    return;
                }
                if (command.disable == false) {
                    message.channel.send('No se puede desactivar el comando por que es esencial');
                    return;
                }
                if (command) {
                    guildDatabase.config.disabledCommands.push(command.name);
                    await guildDatabase.save();
                    message.channel.send('Comando desactivado');
                    return;
                }
                message.channel.send('No encontre el comando');
                break;

            case '-c':
                if (!args[1]) {
                    message.channel.send('Debes poner una categoria');
                    return;
                }
                let categorias = client.categories;
                let argumentos = args[1];
                let ya = guildDatabase.config.disabledCategories;
                if (!categorias.has(argumentos)) {
                    message.channel.send('Esa categoria no existe');
                    return;
                }

                try {
                    const x = require(`../../commands/${argumentos}/index.json`);
                    if (x.disable == undefined) {
                        console.error(`ERROR exit code 81: no esta correctamente configurado el archivo de configuracion ${args}\n`);
                        process.exit(81);
                    }
                    if (x.disable == false) {
                        message.channel.send('Lo siento pero no puedes desactivar esa categoria');
                        return;
                    }
                } catch (err) {
                    console.error(`ERROR exit code 8: no existe el archivo de configuracion de categoria` + err);
                    process.exit(8);
                }

                if (ya.includes(argumentos)) {
                    message.channel.send('Lo siento pero esta categoria ya esta desactivada');
                    return;
                }

                if (categorias.has(argumentos)) {
                    guildDatabase.config.disabledCategories.push(argumentos);
                    guildDatabase.save();
                    message.channel.send('Ok desabilite esa categoria');
                    return;
                }
                break;

            default:
                message.channel.send('Debes especificar que tengo que desactivar asi < -c(categoria) / -co(comando) >');
                break;
        }
    };
};
