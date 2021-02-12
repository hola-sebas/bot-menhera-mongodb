import Discord, { Message } from "discord.js";
import user from "../../../models/user";

export default async function show(message: Message) {
    const embedShopShow = new Discord.MessageEmbed()
        .setColor('RANDOM');
    let usuMencion = message.mentions.users.first() || message.author;
    if (usuMencion.bot) {
        message.channel.send('Los bots no pueden tener una tienda :(');
        return;
    }
    const dbUsu = await user.findOne({ userId: usuMencion.id });


    if (!dbUsu) {
        message.channel.send(`hmm al parecer el no existe en mi base de datos`);
        return;
    }
    let usuMencionShop = dbUsu.inventory.shop.productos;
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
