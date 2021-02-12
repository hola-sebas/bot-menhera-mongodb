import Discord, { Message } from 'discord.js';
import { bot_commands, permissions } from '../../@types/bot-commands';

export default new class command_avatar implements bot_commands {
    name = 'avatar';
    description = 'Muestra tu avatar o de quien menciones';
    usage = 'avatar';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;

    execute = function (message: Message, args: string[]): void {
        let mencion = message.mentions.users.first() || message.author;
        const avatar = new Discord.MessageEmbed()
            .setTitle(`Avatar de ${mencion.tag}`)
            .setDescription(`[Link](${mencion.displayAvatarURL({ size: 1024, dynamic: true })})`)
            .setImage(mencion.displayAvatarURL({ size: 1024, dynamic: true }))
            .setColor('RANDOM');
        message.channel.send(avatar);
        return;
    };
};
