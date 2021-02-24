import { Message } from 'discord.js';
import interfaceGuildModel from '../../@types/mongo/guild-model';
import interfaceUserModel from '../../@types/mongo/user-model';
import render from '../images/rank';

export default new class module_memberXP {
    run = async (message: Message, userDatabase: interfaceUserModel, guildDatabase: interfaceGuildModel) => {
        let currentXP = userDatabase.xp.actual += Math.round(Math.random() * message.content.length);
        let needXP = userDatabase.xp.necesario;

        if (needXP < currentXP) {
            let xpRestante = currentXP - needXP;
            userDatabase.xp.nivel += 1;
            userDatabase.xp.actual = xpRestante;
            userDatabase.xp.necesario = (Math.floor((needXP * 3) / 2));

            let level = userDatabase.xp.nivel;
            needXP = userDatabase.xp.necesario;
            let curXp = userDatabase.xp.actual;
            let color = userDatabase.xp.color;
            let url = userDatabase.xp.url;
            message.channel.startTyping();

            try {
                let img = await render.run(message.author, color, level.toString(), curXp, needXP, url);
                if (guildDatabase.messages.rankNotificationChannel == "0") {
                    message.reply(`Has subido de nivel`, { files: [ img ] }).then(m => m.delete({ timeout: 10000 }));
                } else {
                    var channel = message.guild?.channels.cache.get(guildDatabase.messages.rankNotificationChannel);
                    if (channel?.isText()) {
                        channel.send(`<@${message.author.id}> Has subido de nivel`, { files: [ img ] });
                    }
                }

            } catch (err) { }

            message.channel.stopTyping();
        };
        await userDatabase.save();
    };
};
