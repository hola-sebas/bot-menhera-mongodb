import { GuildMember } from 'discord.js';
import IClient from '../@types/discord-client';
import guild from '../models/guild';

export default new class event_guildMemberRemove {
    name = 'guildMemberRemove';
    run = async function (client: IClient, member: GuildMember): Promise<void> {
        let config = await guild.findOne({ guildId: member.guild.id });
        if (!config) return;
        let idCanal = config.mensajes.goodbye.channel
        if (idCanal == "0") return
        let canal: any = client.channels.cache.find(c => c.id == idCanal)
        let mensaje = config.mensajes.goodbye.message
        let regexUser = /{user}/g
        let regexGuild = /{guild}/g
        let regexMemberCount = /{membercount}/g
        mensaje = mensaje.replace(regexUser, member.user.tag)
            .replace(regexGuild, member.guild.name)
            .replace(regexMemberCount, member.guild.memberCount.toString());
        canal.send(mensaje);
    }
}
