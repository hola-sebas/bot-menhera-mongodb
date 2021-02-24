import Discord, { Message } from "discord.js";
import interfaceUserModel from "../../../@types/mongo/user-model";

export default async function shell(message: Message, args: string[], memberDatabase: interfaceUserModel) {
    let shellArgumentos = args;
    let shellItemToShell = shellArgumentos.slice(1, args.length - 1).join(' ');
    if (!shellItemToShell) {
        message.channel.send('Debes especificar el item que quieres vender');
        return;
    }
    let shellIndexBag = memberDatabase.inventory.bag.findIndex(item => item.item == shellItemToShell);

    if (shellIndexBag == undefined || shellIndexBag == -1) {
        message.channel.send('Hmm al parecer no tienes ese objeto en tu mochila');
        return;
    }
    let shellArgsPrice = args.pop();
    if (!shellArgsPrice) {
        message.channel.send('Debes ponerle un precio al producto');
        return;
    }
    let shellPrecioProducto = parseInt(shellArgsPrice);
    if (isNaN(shellPrecioProducto)) {
        message.channel.send('El precio que especificaste es incorrecto');
        return;
    }
    if (shellPrecioProducto > 1000) {
        message.channel.send('El precio no puede ser mayor a 1000');
        return;
    }
    if (!shellPrecioProducto) {
        message.channel.send('Debes especificar un precio');
        return;
    }
    let shellUsuShop = memberDatabase.inventory.shop.productos;
    if (shellUsuShop.length >= 10) {
        message.channel.send('Ya alcanzaste el maximo de productos en venta (x10)');
        return;
    }

    let shellBagUsu = memberDatabase.inventory.bag.map(item => { if (item.item == shellItemToShell) return item; }).filter(Boolean)[0];
    if (!shellBagUsu) return;
    if (shellBagUsu.cantidad <= 1) {
        memberDatabase.inventory.bag.splice(shellIndexBag, 1);
    } else {
        memberDatabase.inventory.bag.splice(shellIndexBag, 1, { item: shellItemToShell, cantidad: shellBagUsu.cantidad - 1 });
    }
    memberDatabase.inventory.shop.productos.push({ item: shellItemToShell, price: shellPrecioProducto });
    let shelltiendaActualizada = memberDatabase.inventory.shop.productos;
    let shelltodoOK = shelltiendaActualizada.map(itemActializado => {
        return `\`\`\`\nProducto: ${itemActializado.item}\nPrecio: ${itemActializado.price}\n\`\`\``;
    }).join(' ');
    const embedTiendaActualizada = new Discord.MessageEmbed()
        .setDescription(`Ok esta es tu tienda actualizada\n${shelltodoOK}`)
        .setColor('RANDOM');
    message.channel.send(embedTiendaActualizada);
    await memberDatabase.save();
}
