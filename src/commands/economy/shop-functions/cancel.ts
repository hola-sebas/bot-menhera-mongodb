import user from "../../../models/user";
import { Message } from "discord.js";

export default async function cancel(message: Message, args: string[]) {
    let cancelProducto = args.slice(1).join(' ');
    if (!cancelProducto) {
        message.channel.send('Debes escribir un producto para quitar de la venta');
        return;
    }
    const cancelDbAuthor = await user.findOne({ userID: message.author.id });
    if (!cancelDbAuthor) return;
    let cancelIndexShop = cancelDbAuthor.inventory.shop.productos.findIndex(item => item.item == cancelProducto);

    if (cancelIndexShop == -1) {
        message.channel.send('No tienes ese producto a la venta');
        return;
    }

    let cancelIndexBag = cancelDbAuthor.inventory.bag.findIndex(item => item.item == cancelProducto);

    if (cancelIndexBag == -1) {
        cancelDbAuthor.inventory.bag.push({ item: cancelProducto, cantidad: 1 });
        cancelDbAuthor.inventory.shop.productos.splice(cancelIndexShop, 1);
    } else {
        let cancelBagAuthor = cancelDbAuthor.inventory.bag[cancelIndexBag];

        cancelDbAuthor.inventory.bag.splice(cancelIndexBag, 1, { item: cancelBagAuthor.item, cantidad: cancelBagAuthor.cantidad + 1 });
        cancelDbAuthor.inventory.shop.productos.splice(cancelIndexShop, 1);
    }
    message.channel.send(`El producto ${cancelProducto} se ha retirado corectamente`);
    cancelDbAuthor.save();
}
