import user from '../../models/user';
import fetch from 'node-fetch';
import Discord, { Message } from 'discord.js';
import { bot_commands, permissions } from '../../@types/bot-commands';
import IClient from '../../@types/discord-client';
import interfaceGuildModel from '../../@types/mongo/guild-model';
import interfaceUserModel from '../../@types/mongo/user-model';

export default new class command_use implements bot_commands {
    name = 'use';
    description = 'usa un objeto de tu inventario';
    usage = 'use < item >';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;

    async execute(message: Message, args: string[], _client: IClient, _guildDatabase: interfaceGuildModel, memberDatabase: interfaceUserModel): Promise<void> {
        const itemToUse = args.join(' ');
        if (!itemToUse) {
            message.channel.send('Debes poner un item para usar!');
            return;
        }
        let usuBag = memberDatabase.inventory.bag;
        let indexItemBag = usuBag.findIndex(index => index.item == itemToUse);
        if (indexItemBag == -1) {
            message.channel.send('No tienes ese objeto en tu mochila');
            return;
        }
        if (usuBag[indexItemBag].cantidad <= 1) {
            memberDatabase.inventory.bag.splice(indexItemBag, 1);
        } else {
            memberDatabase.inventory.bag.splice(indexItemBag, 1, { item: usuBag[indexItemBag].item, cantidad: usuBag[indexItemBag].cantidad - 1 });
        }
        let gif = await fetch(`https://api.tenor.com/v1/search?q=anime-${itemToUse.replace(/ /g, '-')}&key=IQ1KGGTERBX6&limit=5`)
            .then(res => res.json())
            .then(json => json.results[(Math.floor(Math.random() * 5))].media[0].gif.url);
        const embedGif = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`${message.author.tag} usó ${itemToUse}`)
            .setImage(gif);
        message.channel.send(embedGif);
        await memberDatabase.save();
    };
};
