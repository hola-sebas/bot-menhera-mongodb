import Discord, { Message } from 'discord.js';
import interfaceGuildModel from '../../@types/mongo/guild-model';

const enfriamiento: Discord.Collection<string, boolean> = new Discord.Collection();

export default new class module_autoReply {
    public cooldown: number = 10000;
    public async run(message: Message, guildDatabase: interfaceGuildModel): Promise<void> {
        if (this.conditions(message.content.toLowerCase())) return;
        // respuestas automaticas
        if (enfriamiento.has(message.author.id)) return;
        enfriamiento.set(message.author.id, true);

        setTimeout(() => {
            enfriamiento.delete(message.author.id);
        }, this.cooldown);

        if (!message.guild?.me?.permissionsIn(message.channel).has('SEND_MESSAGES')) return;

        let activado = guildDatabase.messages.autoReply;
        if (activado == false) return;

        if (message.content.toLowerCase().startsWith('hola')) {
            var Saludos = [
                "hola",
                "hey",
                "buen dia, tarde o noche",
                "hola mis bolas XD",
                "ok boomer",
            ];
            message.channel.send(Saludos[Math.floor(Math.random() * Saludos.length)]);
            return;
        } else if ((/^((e)?f(e)?)$/i).test(message.content)) {
            const embed_f = new Discord.MessageEmbed()
                .setDescription(message.author.username + " ha mostrado sus respetos")
                .setColor("RANDOM")
                .setImage("https://gluc.mx/u/fotografias/m/2019/12/30/f608x342-21614_51337_0.png");
            message.channel.send(embed_f).catch(err => err);
            return;
        }
        //fin de las respuestas automaticas
    };
    public conditions(value: string): boolean {
        return (/^((e)?f(e)?)$/i).test(value) || value.startsWith("hola");
    }
};
