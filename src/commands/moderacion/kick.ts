import { Message } from "discord.js";
import { bot_commands, permissions } from "../../@types/bot-commands"

export default new class command_kick implements bot_commands {
    name = 'kick';
    description = 'Para expulsar a alguien';
    usage = 'kick <@usuario>';
    aliases = ['ki', 'ck'];
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'KICK_MEMBERS', 'ADD_REACTIONS'];
    category = __dirname.split(require('path').sep).pop();
    disable = false;

    execute = function (message: Message, args: string[]): void {
        message.channel.send('Modulo en construccion')
    }
}
