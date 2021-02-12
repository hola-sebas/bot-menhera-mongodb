import fetch from 'node-fetch';
import { Message } from 'discord.js';
import { bot_commands, permissions } from '../../@types/bot-commands';

export default new class command_chiste implements bot_commands {
    name = 'chiste';
    description = 'Te envio un chiste totalmente aleatorio y malo';
    usage = 'chiste';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    execute = async (message: Message, args: string[]) => {
        fetch('http://risapi.glitch.me/')
            .then(res => res.json())
            .then(json => message.channel.send(`\`\`\`${json.chiste}\`\`\``));
    };
};
