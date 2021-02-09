import bugs from '../../models/bugs';
import discord from "discord.js";
import { bot_commands, permissions } from "../../@types/bot-commands";

export default new class command_bugreport implements bot_commands {
    name = 'bugreport';
    description = 'Reporta un bug que encontraste por ahí';
    usage = 'bugreport <bug>';
    aliases = ['bug'];
    permissions: permissions[] = ["VIEW_CHANNEL", "SEND_MESSAGES"];
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    cooldown = 120;
    execute = async function (message: discord.Message, args: string[]): Promise<void> {
        try {
            if (!args.length) {
                message.channel.send('Debes poner un bug para reportar');
                return;
            }
            let config = await bugs.findOne({ userId: message.author.id })
            let bug = args.join(' ')
            if (bug.length > 1000) {
                message.channel.send('No puedes poner un bug mayor a 1000 caracteres');
                return;
            }
            if (!config) {
                const newBug = new bugs({
                    userId: message.author.id,
                    username: message.author.username,
                    bug: [bug]
                })
                newBug.save()
                message.channel.send('Se a reportado el bug correctamente, gracias por apoyar a mejorar este bot')
            } else {
                config.bug.push(bug)
                await bugs.findOneAndUpdate({ userId: message.author.id }, {
                    userId: message.author.id,
                    username: message.author.username,
                    bug: config.bug
                })
                message.channel.send('Se a reportado el bug correctamente, gracias por apoyar a mejorar este bot')
            }
        } catch (err) {
            message.channel.send('Lo siento hubo un error al reportar el bug :(')
            console.log('\n', err);
        }
    }
}
