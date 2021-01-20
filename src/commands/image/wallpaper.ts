import Discord, { Message } from 'discord.js';
import { bot_commands, permissions } from "../../@types/bot-commands";
import clientN from "nekos.life";
const neko = new clientN();

export default new class command_wallpaper implements bot_commands {
    name = 'wallpaper';
    description = ['Te doy un wallpaer para otakus sin vida social \n',
        'DISCLAIMER: estos wallpapers son de una API externa y puede contener imagenes nsfw, usalo bajo tu responsabilidad'].join();
    usage = 'wallpaper';
    aliases = ['wall'];
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;

    execute = async function (message: Message, args: string[]): Promise<void> {
        let wallpaper = await neko.sfw.wallpaper();
        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`<@${message.author.id}> Aqui tienes tu wallpaper`)
            .setImage(wallpaper.url);
        message.channel.send(embed);
        return;
    }
}
