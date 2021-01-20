import Discord, { Message } from 'discord.js';
import guild from '../../models/guild';
const enfriamiento: Discord.Collection<string, boolean> = new Discord.Collection();

export default new class module_autoReply {
    cooldown: number = 10000
    run = async (message: Message): Promise<void> => {
        if(this.conditions(message.content.toLowerCase())) return;
        // respuestas automaticas
        if (enfriamiento.has(message.author.id)) return;
        enfriamiento.set(message.author.id, true);

        setTimeout(() => {
            enfriamiento.delete(message.author.id);
        }, this.cooldown);

        if (!message.guild?.me?.permissionsIn(message.channel).has('SEND_MESSAGES')) return;

        let mensaje = message.content.toLowerCase();

        let config = await guild.findOne({ guildId: message.guild.id });
        if (!config) return;
        let activado = config.mensajes.autoReply
        if (activado == false) return;

        if (mensaje.startsWith('hola')) {
            var Saludos = [
                "hola",
                "hey",
                "buen dia, tarde o noche",
                "hola mis bolas XD",
                "ok boomer",
            ];
            message.channel.send(Saludos[Math.floor(Math.random() * Saludos.length)]);
            return
        } else if (mensaje == 'f' || mensaje == 'efe' || mensaje == 'ef') {
            const embed_f = new Discord.MessageEmbed()
                .setDescription(message.author.username + " ha mostrado sus respetos")
                .setColor("RANDOM")
                .setImage("https://gluc.mx/u/fotografias/m/2019/12/30/f608x342-21614_51337_0.png");
            message.channel.send(embed_f).catch(err => err);
            return
        }
        //fin de las respuestas automaticas
    }
    private conditions(value: string): boolean {
        if (value.startsWith("hola")) return true;
        switch (value) {
            case "f":
            case "efe":
            case "ef":
                return true;
            default:
                return false;
        }
    }
}
