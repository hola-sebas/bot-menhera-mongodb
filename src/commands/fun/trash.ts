import Discord, { Message } from 'discord.js';
import { Canvas } from "swiftcord";
import { bot_commands, permissions } from '../../@types/bot-commands';

export default new class command_trash implements bot_commands {
    name = 'trash';
    description = 'Eres una basura';
    usage = 'trash (usuario)';
    aliases = ['basura'];
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    execute = async function (message: Message, args: string[]): Promise<void> {
        let user = message.mentions.users.first() || message.author
        const canva = new Canvas()
        let avatar = user.displayAvatarURL({ dynamic: false, format: 'png', size: 1024 });
        let image = await canva.delete(avatar);
        let attachment = new Discord.MessageAttachment(image, `${user.username}esbasura.jpg`);
        message.channel.send(attachment);
        return;
    }
}
