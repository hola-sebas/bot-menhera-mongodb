import Discord, { Message } from "discord.js";
import user from "../../../models/user";

export async function open(message: Message) {
    const openDbAuthor = await user.findOne({ userId: message.author.id });
    if (!openDbAuthor) return;
    let openShopOpen = openDbAuthor.inventory.shop.open;
    if (openShopOpen) {
        message.channel.send('Tu tienda ya esta abierta');
    } else {
        openDbAuthor.inventory.shop.open = true;
        openDbAuthor.save();
        message.reply('Abriste tu tienda!');
    }
}
export async function close(message: Message) {
    const closeDbAuthor = await user.findOne({ userId: message.author.id });
    if (!closeDbAuthor) return;
    let closeShopOpen = closeDbAuthor.inventory.shop.open;
    if (closeShopOpen) {
        closeDbAuthor.inventory.shop.open = false;
        closeDbAuthor.save();
        message.reply('Cerraste tu tienda!');
    } else {
        message.channel.send('Tu tienda ya esta cerrada');
    }
}
export async function info(message: Message) {
    let infoUsu = message.mentions.users.first() || message.author;
    const infoDbUsu = await user.findOne({ userId: infoUsu.id });
    if (!infoDbUsu) {
        message.channel.send('hmm no tengo datos de el ususario');
        return;
    }
    let infoVentasUsu = infoDbUsu.inventory.shop.ventas.usuario;
    let infoVentasProducto = infoDbUsu.inventory.shop.ventas.producto;
    let infoVentasFecha: Date | string = infoDbUsu.inventory.shop.ventas.fecha;
    if (infoVentasFecha == undefined) infoVentasFecha = 'No hay datos';
    let infoComprasUsu = infoDbUsu.inventory.shop.compras.usuario;
    let infoComprasProducto = infoDbUsu.inventory.shop.compras.producto;
    let infoComprasFecha = infoDbUsu.inventory.shop.compras.fecha;
    const infoEmbed = new Discord.MessageEmbed()
        .setTitle(`Informacion hacerca de las transacciones de ${infoUsu.tag}`)
        .addField(`**Ventas**`, `*Ultimo usuario registrado:*\n👤 ${infoVentasUsu}\n*Ultimo producto registrado:*\n🏷 ${infoVentasProducto}\n*Ultima fecha registrada:*\n📆 ${infoVentasFecha}`, true)
        .addField(`**Compras**`, `*Ultimo usuario registrado:*\n👤 ${infoComprasUsu}\n*Ultimo producto registrado:*\n🏷 ${infoComprasProducto}\n*Ultima fecha registrada:*\n📆 ${infoComprasFecha}`, true)
        .setColor('RANDOM')
        .setFooter(`Consultado por: ${message.author.tag}`, message.author.displayAvatarURL());
    message.channel.send(infoEmbed);
}
