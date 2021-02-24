import Discord, { Message } from "discord.js";
import interfaceUserModel from "../../../@types/mongo/user-model";
import userModel from "../../../models/user";

export async function open(message: Message, memberDatabase: interfaceUserModel) {
    let openShopOpen = memberDatabase.inventory.shop.open;
    if (openShopOpen) {
        message.channel.send('Tu tienda ya esta abierta');
    } else {
        memberDatabase.inventory.shop.open = true;
        await memberDatabase.save();
        message.reply('Abriste tu tienda!');
    }
}
export async function close(message: Message, memberDatabase: interfaceUserModel) {
    let closeShopOpen = memberDatabase.inventory.shop.open;
    if (closeShopOpen) {
        memberDatabase.inventory.shop.open = false;
        await memberDatabase.save();
        message.reply('Cerraste tu tienda!');
    } else {
        message.channel.send('Tu tienda ya esta cerrada');
    }
}
export async function info(message: Message, memberDatabase: interfaceUserModel) {
    let user = message.mentions.users.first() || message.author;
    if (message.mentions.users.first()) {
        var database = await userModel.findOne({ userID: user.id });
        if (!database) {
            message.channel.send('hmm no tengo datos de el ususario');
            return;
        }
        memberDatabase = database;
    }
    let infoVentasUsu = memberDatabase.inventory.shop.ventas.usuario;
    let infoVentasProducto = memberDatabase.inventory.shop.ventas.producto;
    let infoVentasFecha: Date | string = memberDatabase.inventory.shop.ventas.fecha;
    if (!infoVentasFecha) infoVentasFecha = 'No hay datos';
    let infoComprasUsu = memberDatabase.inventory.shop.compras.usuario;
    let infoComprasProducto = memberDatabase.inventory.shop.compras.producto;
    let infoComprasFecha = memberDatabase.inventory.shop.compras.fecha;
    const infoEmbed = new Discord.MessageEmbed()
        .setTitle(`Informacion hacerca de las transacciones de ${user.tag}`)
        .addField(`**Ventas**`, `*Ultimo usuario registrado:*\n👤 ${infoVentasUsu}\n*Ultimo producto registrado:*\n🏷 ${infoVentasProducto}\n*Ultima fecha registrada:*\n📆 ${infoVentasFecha}`, true)
        .addField(`**Compras**`, `*Ultimo usuario registrado:*\n👤 ${infoComprasUsu}\n*Ultimo producto registrado:*\n🏷 ${infoComprasProducto}\n*Ultima fecha registrada:*\n📆 ${infoComprasFecha}`, true)
        .setColor('RANDOM')
        .setFooter(`Consultado por: ${message.author.tag}`, message.author.displayAvatarURL());
    message.channel.send(infoEmbed);
}
