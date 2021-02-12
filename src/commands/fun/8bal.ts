import Discord, { Message } from 'discord.js';
import { bot_commands, permissions } from '../../@types/bot-commands';

export default new class command_8ball implements bot_commands {
    name = '8ball';
    description = 'Preguntame cualquier cosa y yo te responeré con un si o no';
    usage = '8ball <pregunta>';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    execute = function (message: Message, args: string[]): void {
        if (!args.length) {
            message.channel.send('Debes poner una pregunta');
            return;
        }
        let YesorNot: number | string = Math.round(Math.random() * 1);
        if (!YesorNot) {
            YesorNot = 'no';
        } else
            YesorNot = 'si';
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .addField('Tu pregunta: ', args.join(' '))
            .addField('Mi respuesta: ', YesorNot)
            .setFooter(`Convocado por ${message.author.tag}`, message.author.displayAvatarURL());
        message.channel.send(embed);
    };
};
