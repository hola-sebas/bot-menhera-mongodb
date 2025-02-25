import { Message } from "discord.js";
import IClient from "../../../@types/discord-client";
import interfaceUserModel from "../../../@types/mongo/user-model";
import user from "../../../models/user";

export default async function buy(message: Message, args: string[], client: IClient, memberDatabase: interfaceUserModel) {
    const buyUsuMencion = message.mentions.users.first();
    if (!buyUsuMencion) {
        message.channel.send('Debes mencionar a un usuario para comprarle');
        return;
    };
    if (buyUsuMencion.id == message.author.id) {
        message.channel.send('No te puedes comparte a ti mismo');
        return;
    };
    if (buyUsuMencion.id == client.user.id) {
        message.channel.send('No tengo tiempo para abrir una tienda');
        return;
    };
    const buyDbMencion = await user.findOne({ userID: buyUsuMencion.id });
    if (!buyDbMencion) {
        message.channel.send('hmm no tengo datos de este usuario');
        return;
    };
    if (!buyDbMencion.inventory.shop.open) {
        message.channel.send(`${buyUsuMencion} tiene la tienda cerrada vuelve mas tarde o pidele que la abra`);
        return;
    };
    let buyProductoAComprar = args.slice(2).join(' ');
    if (!buyProductoAComprar) {
        message.channel.send('Debes escribir un producto para comprar');
        return;
    };
    let buyIndexShop = buyDbMencion.inventory.shop.productos.findIndex(item => item.item == buyProductoAComprar);
    if (buyIndexShop == -1) {
        message.channel.send('El usuario no tiene ese producto');
        return;
    };
    let buyProducto = buyDbMencion.inventory.shop.productos.map(item => {
        if (item.item == buyProductoAComprar) return item;
    }).filter(Boolean)[0];

    if (!buyProducto) return;

    let buyMoneyAuthor = memberDatabase.money.efectivo;
    if (buyProducto.price > buyMoneyAuthor) {
        message.channel.send('No tienes el dinero en efectivo suficiente para comprar ese producto');
        return;
    };
    memberDatabase.money.efectivo -= buyProducto.price;
    buyDbMencion.money.bank += buyProducto.price;
    let buyIndexBagAuthor = memberDatabase.inventory.bag.findIndex(item => item.item == buyProductoAComprar);

    let buyBagItemAuthor = memberDatabase.inventory.bag.map(item => {
        if (item.item == buyProductoAComprar) return item;
    }).filter(Boolean)[0];
    if (!buyBagItemAuthor) return;
    if (buyIndexBagAuthor == -1) {
        memberDatabase.inventory.bag.push({ item: buyProductoAComprar, cantidad: 1 });
    } else {
        memberDatabase.inventory.bag.splice(buyIndexBagAuthor, 1, { item: buyBagItemAuthor.item, cantidad: buyBagItemAuthor.cantidad + 1 });
    };
    buyDbMencion.inventory.shop.productos.splice(buyIndexShop, 1);
    buyDbMencion.inventory.shop.ventas.usuario = `${message.author.tag}(${message.author.id})`;
    buyDbMencion.inventory.shop.ventas.producto = buyProductoAComprar;
    buyDbMencion.inventory.shop.ventas.fecha = new Date();
    memberDatabase.inventory.shop.compras.producto = buyProductoAComprar;
    memberDatabase.inventory.shop.compras.usuario = `${buyUsuMencion.tag}(${buyUsuMencion.id})`;
    memberDatabase.inventory.shop.compras.fecha = new Date();
    message.channel.send(`Compraste ${buyProductoAComprar} por un precio de ${buyProducto.price}\$`);
    await memberDatabase.save();
    await buyDbMencion.save();
}
