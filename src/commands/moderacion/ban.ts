import { Message } from "discord.js";
import { bot_commands, permissions } from "../../@types/bot-commands";

export default new class command_ban implements bot_commands {
    name = 'ban';
    description = 'Si se lo merece no lo pienses dos veces (⌐■_■)';
    usage = 'ban <@usuario>';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'BAN_MEMBERS', 'ADD_REACTIONS'];
    authorPermissions: permissions[] = ["ADMINISTRATOR", "BAN_MEMBERS"];
    category = __dirname.split(require('path').sep).pop();
    disable = false;

    execute = function (message: Message, args: string[]): void {
        message.channel.send('Se ejecutó el comando ban');
    };
};
