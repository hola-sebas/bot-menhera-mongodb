import Discord, { Message } from 'discord.js';
import swiftcord from "swiftcord";
import { bot_commands, permissions } from '../../@types/bot-commands';

export default new class command_batslap implements bot_commands {
    name = 'batslap';
    description = 'Recibe una baticachetada';
    usage = 'batslap';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    execute = async function (message: Message, args: string[]): Promise<void> {
        let user = message.mentions.users.first();
        if (!user) {
            message.channel.send('Menciona a alguien para darle una baticachetada');
            return;
        }
        const canva = new swiftcord.Canvas();
        let avatar = user.displayAvatarURL({ dynamic: false, format: 'png', size: 1024 });
        let image = await canva.batslap(message.author.displayAvatarURL({ dynamic: false, format: 'png', size: 1024 }), avatar);
        let attachment = new Discord.MessageAttachment(image, "batslap.png");
        message.channel.send(attachment);
        return;
    };
};
