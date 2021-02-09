import { Message } from 'discord.js';
import { meme } from 'memejs';
import { bot_commands, permissions } from '../../@types/bot-commands';

export default new class command_meme implements bot_commands {
    name = 'meme';
    description = 'Te envio los mejores memes de reddit';
    usage = 'meme';
    aliases = ['momo', 'memes'];
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;

    execute = function (message: Message, args: string[]): void {
        message.channel.startTyping();
        let memes = ["MemesESP", "spanishmemes", "SpanishMeme", "mexico", "MemesEnEspanol"];
        let random = Math.round(Math.random() * memes.length);
        meme(memes[random], function (err: Error, data: { title: any; url: any; }) {
            if (err) {
                message.channel.send('Momento sad\nHubo un error al tratar de buscar memes, intentalo de nuevo ')
                    .then(m => m.delete({ timeout: 10000 }));
                message.channel.stopTyping();
                return;
            }
            message.channel.send(`${data.title}\n${data.url}`)
                .catch(err => {
                    message.channel.send('Momento sad\nHubo un error al tratar de buscar memes, intentalo de nuevo ')
                        .then(m => m.delete({ timeout: 10000 }));
                    message.channel.stopTyping();
                    return;
                });
        });
        message.channel.stopTyping();
    };
};
