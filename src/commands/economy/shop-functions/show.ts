import Discord, { Message } from "discord.js";
import interfaceUserModel from "../../../@types/mongo/user-model";
import userModel from "../../../models/user";

export default async function show(message: Message, memberDatabase: interfaceUserModel) {
    const embedShopShow = new Discord.MessageEmbed()
        .setColor('RANDOM');
    let usuMencion = message.mentions.users.first() || message.author;
    if (usuMencion.bot) {
        message.channel.send('Los bots no pueden tener una tienda :(');
        return;
    }
    if (message.mentions.users.first()) {
        var database = await userModel.findOne({ userID: usuMencion.id });
        if (!database) {
            message.channel.send('hmm no tengo datos de el ususario');
            return;
        }
        memberDatabase = database;
    }
    let usuMencionShop = memberDatabase.inventory.shop.productos;
    if (!usuMencionShop.length) {
        embedShopShow.setTitle(`Tienda de ${usuMencion.tag}`);
        embedShopShow.setDescription(`El usuario ${usuMencion} no tiene ningun objeto a la venta`);
        message.channel.send(embedShopShow);
        return;
    }
    embedShopShow.setTitle(`Tienda de ${usuMencion.tag}`);
    embedShopShow.setDescription(usuMencionShop.map(item => {
        return `\`\`\`Producto: ${item.item}\nPrecio: ${item.price}\`\`\``;
    }).join(' '));
    message.channel.send(embedShopShow);
}
