import Discord, { Message } from 'discord.js';
import IClient from '../../@types/discord-client';

import configJSON from '../../config';
import guild from '../../models/guild';

const enfriamiento = new Discord.Collection<string, boolean>();

export default new class module_mencion {
    cooldown: number = 10000;
    run = async (message: Message, client: IClient) => {
        var regexp: RegExp = new RegExp(`^<@${client.user.id}>$`);
        if (regexp.test(message.content)) return;

        if (enfriamiento.has(message.author.id)) return;
        enfriamiento.set(message.author.id, true);
        setTimeout(() => {
            enfriamiento.delete(message.author.id);
        }, this.cooldown);

        let config = await guild.findOne({ guildId: message.guild?.id });
        if (!config) return;
        let prefix = config.configuracion.prefix || configJSON.prefix;

        // si se menciona el bot responde con su prefijo

        if (!message.guild?.me?.permissionsIn(message.channel).has('SEND_MESSAGES')) return;

        if (message.content.match(regexp)) {
            const embed_mencion = new Discord.MessageEmbed()
                .setDescription(`Hola! mi prefijo es: ${prefix} <:mashahello:735880082887016569>`)
                .setColor(0xf1c40f);
            message.channel.send(embed_mencion).catch(err => err);
        }
        //fin de mencion con respuesta
    };
};
