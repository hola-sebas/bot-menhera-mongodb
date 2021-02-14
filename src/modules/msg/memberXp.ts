import { Message } from 'discord.js';
import user from '../../models/user';
import render from '../images/rank';

export default new class module_memberXP {
    run = async (message: Message) => {
        let config = await user.findOne({ userID: message.author.id });
        if (!config) return;
        let currentXP = config.xp.actual += Math.round(Math.random() * message.content.length);
        let needXP = config.xp.necesario;

        if (needXP < currentXP) {
            let xpRestante = currentXP - needXP;
            config.xp.nivel += 1;
            config.xp.actual = xpRestante;
            config.xp.necesario = (Math.floor((needXP * 3) / 2));

            let level = config.xp.nivel;
            needXP = config.xp.necesario;
            let curXp = config.xp.actual;
            let color = config.xp.color;
            let url = config.xp.url;
            message.channel.startTyping();
            let img = await render.run(message.author, color, level.toString(), curXp, needXP, url).catch(err => err);
            message.reply(`Has subido de nivel`, { files: [img] }).then(m => m.delete({ timeout: 10000 })).catch(err => err);
            message.channel.stopTyping();
        };
        await config.save();
    };
};
