import Discord, { Message } from "discord.js";
import { bot_commands, permissions } from "../../@types/bot-commands";

export default new class command_channel implements bot_commands {
    name = 'channel';
    description = 'Muestra toda la info de un canal';
    usage = 'channel <#canal>';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'];
    authorPermissions: permissions[] = ["MANAGE_CHANNELS"];
    category = __dirname.split(require('path').sep).pop();
    disable = true;

    execute = function (message: Message): void {
        let canal = message.mentions.channels.first() || message.channel;
        if (canal.type == "dm") return;

        const embedCanal1 = new Discord.MessageEmbed()
            .setTitle(`Hacerca de el canal #${canal.name}`)
            .setColor("RANDOM")
            .addField("Nombre: ", `\`\`\`md\n#${canal.name}\`\`\``, true)
            .addField("Tipo: ", `\`\`\`css\n${canal.type}\`\`\``, true)
            .setThumbnail('https://media.discordapp.net/attachments/736287295522603098/742490666692509776/274-2748314_freetoedit-menherachan-animegirl-animecute-png-kawaii-anime-girl.png?width=492&height=585');
        if (canal.topic) {
            embedCanal1.addField("Tema: ", `\`\`\`${canal.topic}\`\`\``, false);
        }
        embedCanal1.addField("ID: ", `\`\`\`prolog\n${canal.id}\`\`\``, true);
        if (canal.nsfw == true) {
            embedCanal1.addField("nsfw: ", `\`\`\`diff\n+ ${canal.nsfw}\`\`\``, true);
        } else {
            embedCanal1.addField("nsfw: ", `\`\`\`diff\n- ${canal.nsfw}\`\`\``, true);
        }
        message.channel.send(embedCanal1);
    };
};
