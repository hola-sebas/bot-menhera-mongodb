import Discord from 'discord.js';
import { bot_commands, permissions } from '../../@types/bot-commands';
import IClient from '../../@types/discord-client';
import buy from "./shop-functions/buy";
import cancel from "./shop-functions/cancel";
import { open, close, info } from "./shop-functions/open-close-info";
import shell from "./shop-functions/shell";
import show from "./shop-functions/show";

export default new class command_shop implements bot_commands {
    name = 'shop';
    description = 'Compra, vende y revisa la tienda de otros jugadores';
    usage = 'shop < buy / shell / show / cancel / open / close / info >';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    
    execute = async function (message: Discord.Message, args: string[], client: IClient): Promise<void> {
        const accion = args[0];
        if (!accion) {
            message.channel.send('Debes especificar una accion para realizar asi \`buy\` \`shell\` \`show\` \`cancel\` \`open\` \`close\` \`info\`');
            return;
        }
        switch (accion) {
            case 'buy':
                buy(message, args, client);
                break;
            case 'shell':
                shell(message, args);
                break;
            case 'show':
                show(message);
                break;
            case 'cancel':
                cancel(message, args);
                break
            case 'open':
                open(message);
                break;
            case 'close':
                close(message);
                break;
            case 'info':
                info(message);
                break;
            default:
                message.channel.send('Esa accion no existe\nDebes especificar una accion para realizar asi \`buy\` \`shell\` \`show\` \`cancel\` \`open\` \`close\` \`info\`')
                break;
        }
    }
}
