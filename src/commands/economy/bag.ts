import user from '../../models/user';
import Discord from 'discord.js';
import { bot_commands, permissions } from '../../@types/bot-commands';

export default new class command_bag implements bot_commands {
    name = 'bag';
    description = 'Muestra las cosas que tienes en tu mochila';
    usage = 'bag';
    aliases = ['inventory', 'mochila'];
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;

    execute = async function (message: Discord.Message, args: string[]): Promise<void> {
        let config = await user.findOne({ userId: message.author.id });
        if (!config) return;
        let bag = config.inventory.bag;

        const embedBag = new Discord.MessageEmbed()
            .setAuthor(`Mochila de ${message.author.username}`, message.author.displayAvatarURL())
            .setColor('RANDOM')
            .setThumbnail(`https://pbs.twimg.com/media/DfH9bqqV4AAJkc5.jpg`)
            .setDescription('');
        if (!bag.length) {
            embedBag.setDescription('No hay objetos en tu mochila u.u');
        } else {
            embedBag.addField('Lista de items', bag.map(item => {
                return `• ${item.item} (x${item.cantidad})`;
            }));
        };
        message.channel.send(embedBag);
        return;
    };
};
