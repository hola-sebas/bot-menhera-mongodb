import Discord, { Message } from "discord.js";
import user from "../../../models/user";

export default async function shell(message: Message, args: string[]) {
    let shellArgumentos = args;
    let shellItemToShell = shellArgumentos.slice(1, args.length - 1).join(' ');
    if (!shellItemToShell) {
        message.channel.send('Debes especificar el item que quieres vender');
        return;
    }
    const shellConfig = await user.findOne({ userID: message.author.id });
    if (!shellConfig) return;
    let shellIndexBag = shellConfig.inventory.bag.findIndex(item => item.item == shellItemToShell);

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
    let shellUsuShop = shellConfig.inventory.shop.productos;
    if (shellUsuShop.length >= 10) {
        message.channel.send('Ya alcanzaste el maximo de productos en venta (x10)');
        return;
    }

    let shellBagUsu = shellConfig.inventory.bag.map(item => { if (item.item == shellItemToShell) return item; }).filter(Boolean)[0];
    if (!shellBagUsu) return;
    if (shellBagUsu.cantidad <= 1) {
        shellConfig.inventory.bag.splice(shellIndexBag, 1);
    } else {
        shellConfig.inventory.bag.splice(shellIndexBag, 1, { item: shellItemToShell, cantidad: shellBagUsu.cantidad - 1 });
    }
    shellConfig.inventory.shop.productos.push({ item: shellItemToShell, price: shellPrecioProducto });
    let shelltiendaActualizada = shellConfig.inventory.shop.productos;
    let shelltodoOK = shelltiendaActualizada.map(itemActializado => {
        return `\`\`\`\nProducto: ${itemActializado.item}\nPrecio: ${itemActializado.price}\n\`\`\``;
    }).join(' ');
    const embedTiendaActualizada = new Discord.MessageEmbed()
        .setDescription(`Ok esta es tu tienda actualizada\n${shelltodoOK}`)
        .setColor('RANDOM');
    message.channel.send(embedTiendaActualizada);
    shellConfig.save();
}
