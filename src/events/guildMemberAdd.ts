import { GuildMember } from "discord.js";
import IClient from "../@types/discord-client";
import guild from '../models/guild';
import cardRender from "../modules/images/card";

export default new class event_guildMemberAdd {
    name = 'guildMemberAdd';
    run = async function (client: IClient, member: GuildMember): Promise<void> {
        let config = await guild.findOne({ guildID: member.guild.id });
        if (!config) return;
        let buscar = config.messages.welcome.channel;
        if (buscar == "0") return;
        let img = config.messages.welcome.img;
        let msg = config.messages.welcome.message;
        let regex = /@{member}/g;
        let regex1 = /{member}/g;
        if (regex.test(msg)) {
            msg = msg.replace(regex, `<@${member.user.id}>`);
        } else if (regex1.test(msg)) {
            msg = msg.replace(regex1, member.user.username);
        }
        msg = msg.replace(/{guild}/g, member.guild.name);
        msg = msg.replace(/{membercount}/g, member.guild.memberCount.toString());

        let canal = client.channels.cache.find(c => c.id == buscar);
        if (!canal) return;
        if (!member.guild.me?.permissionsIn(canal).has(["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES"])) {
            let ownerGuild = member.guild.ownerID;
            client.users.cache.find(c => c.id == ownerGuild)?.send(`**ATENCION** no puedo enviar mensajes en el canal <#${canal.id}> revisa los permisos y reconfigura el canal de bienvenidas`);
            return;
        };
        let imagen = await cardRender.run(member.user, img, config.messages.welcome.imgMessage).catch((err) => err);
        if (canal.isText()){
            canal.send(`${msg}`, { files: [imagen] }).catch((err) => err);
        }
    };
};
