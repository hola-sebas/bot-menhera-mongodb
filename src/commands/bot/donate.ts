import discord from 'discord.js';
import { bot_commands, permissions } from "../../@types/bot-commands";

export default new class commmand_donate implements bot_commands {
    name = 'donate';
    description = 'Te envio informacion hacerca de las donaciones';
    usage = 'donate';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    execute = function (message: discord.Message, args: string[]): void {
        const exampleEmbed = new discord.MessageEmbed()
            .setTitle('Donaciones')
            .setDescription('Como ya sabes tienes completamente gratis todo los comandos y demas pero requiero de dinero para poder sostenerme si me donas estaria ayudando a poder mejorarme cada dia mas, mejor ping, mejor experiencia y demas\nDoname un cafe pls:\nhttps://ko-fi.com/dannypalma')
            .setColor('RANDOM')
            .setImage('https://cdn.discordapp.com/attachments/736287295522603098/738157976346558464/coffe.png')
            .setThumbnail('https://www.pngitem.com/pimgs/m/507-5073089_menhera-chan-animegirl-menhera-chan-sticker-hd-png.png');

        message.channel.send(exampleEmbed);
        return;
    };
};
