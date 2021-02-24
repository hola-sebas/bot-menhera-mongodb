import { bot_commands, permissions } from '../../@types/bot-commands';
import guild from '../../models/guild';
import Discord from "discord.js";
import IClient from '../../@types/discord-client';
import interfaceGuildModel from '../../@types/mongo/guild-model';

export default new class command_autoreply implements bot_commands {
    name = 'autoreply';
    description = 'Configura si deseas que responda a mensajes automaticamente';
    usage = 'autoreply';
    aliases = ['reply'];
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL'];
    authorPermissions: permissions[] = ["ADMINISTRATOR"];
    category = __dirname.split(require('path').sep).pop();
    disable = false;
    cooldown = 5;

    async execute(message: Discord.Message, _args: string[], _client: IClient, guildDatabase: interfaceGuildModel): Promise<void> {
        let activado = guildDatabase.messages.autoReply;
        if (activado == undefined || activado == true) {
            guildDatabase.messages.autoReply = false;
            await guildDatabase.save();
            message.channel.send('Ok **Desactive** la respuesta automatica a mensajes');
        } else if (activado == false) {
            guildDatabase.messages.autoReply = true;
            await guildDatabase.save();
            message.channel.send('Ok **Active** la respuesta automatica a mensajes');
        };
    };
};
