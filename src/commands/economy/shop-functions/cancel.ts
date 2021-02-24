import { Message } from "discord.js";
import interfaceUserModel from "../../../@types/mongo/user-model";

export default async function cancel(message: Message, args: string[], memberDatabase: interfaceUserModel) {
    let cancelProducto = args.slice(1).join(' ');
    if (!cancelProducto) {
        message.channel.send('Debes escribir un producto para quitar de la venta');
        return;
    }
    let cancelIndexShop = memberDatabase.inventory.shop.productos.findIndex(item => item.item == cancelProducto);

    if (cancelIndexShop == -1) {
        message.channel.send('No tienes ese producto a la venta');
        return;
    }

    let cancelIndexBag = memberDatabase.inventory.bag.findIndex(item => item.item == cancelProducto);

    if (cancelIndexBag == -1) {
        memberDatabase.inventory.bag.push({ item: cancelProducto, cantidad: 1 });
        memberDatabase.inventory.shop.productos.splice(cancelIndexShop, 1);
    } else {
        let cancelBagAuthor = memberDatabase.inventory.bag[cancelIndexBag];

        memberDatabase.inventory.bag.splice(cancelIndexBag, 1, { item: cancelBagAuthor.item, cantidad: cancelBagAuthor.cantidad + 1 });
        memberDatabase.inventory.shop.productos.splice(cancelIndexShop, 1);
    }
    message.channel.send(`El producto ${cancelProducto} se ha retirado corectamente`);
    await memberDatabase.save();
}
