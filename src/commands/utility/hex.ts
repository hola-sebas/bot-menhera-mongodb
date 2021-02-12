import Discord, { Message } from 'discord.js';
import { Canvas } from "swiftcord";
import regx from "hex-color-regex";
import { bot_commands, permissions } from '../../@types/bot-commands';

export default new class command_hex implements bot_commands {
    name = 'hex';
    description = 'Dame un color en formato hex y le lo devuelvo en una imagen';
    usage = 'hex <#color>';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    execute = async function (message: Message, args: string[]): Promise<void> {
        var color = args[0];
        if (!color) {
            message.channel.send('Debes poner un color en codigo hexadecimal');
            return;
        }

        if (color.indexOf('#') == 0) {
            color = color.substr(1, color.length - 1);
        }
        if (!regx({ strict: true }).test(`#${color}`)) {
            message.channel.send('No es un color');
            return;
        }
        const sc = new Canvas();
        let img = await sc.color(`#${color}`);
        let imagen = new Discord.MessageAttachment(img, `hex_${color}.png`);

        const embed = new Discord.MessageEmbed()
            .setTitle(`Color #${color}`)
            .attachFiles([imagen])
            .setImage(`attachment://hex_${color}.png`)
            .setColor(`#${color}`);
        message.channel.send(embed);
    };
};
