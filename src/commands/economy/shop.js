const fs = require('fs'),
    Discord = require('discord.js'),
    user = require('../../models/user')
module.exports = {
    name: 'shop',
    description: 'Compra, vende y revisa la tienda de otros jugadores',
    usage: 'shop < buy / shell / show / cancel / open / close / info >',
    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
    category: __dirname.split('\\').pop(),
    disable: true,
    execute: async (message, args, prefix, client) => {
        const accion = args[0]
        if (!accion) return message.channel.send('Debes especificar una accion para realizar asi \`buy\` \`shell\` \`show\` \`cancel\` \`open\` \`close\` \`info\`')
        switch (accion) {
            case 'buy':
                let buyArgs = args
                const buyUsuMencion = message.mentions.users.first()
                if (!buyUsuMencion) return message.channel.send('Debes mencionar a un usuario para comprarle')
                if (buyUsuMencion.id == message.author.id) return message.channel.send('No te puedes comparte a ti mismo')
                if (buyUsuMencion.id == client.user.id) return message.channel.send('No tengo tiempo para abrir una tienda')
                const buyDbMencion = await user.findOne({ userId: buyUsuMencion.id })
                if (!buyDbMencion) return message.channel.send('hmm no tengo datos de este usuario')
                if (!buyDbMencion.inventory.shop.open) return message.channel.send(`${buyUsuMencion} tiene la tienda cerrada vuelve mas tarde o pidele que la abra`)
                let buyProductoAComprar = buyArgs.slice(2).join(' ')
                if (!buyProductoAComprar) return message.channel.send('Debes escribir un producto para comprar')
                let buyIndexShop = buyDbMencion.inventory.shop.productos.findIndex(item => item.item == buyProductoAComprar)
                if (buyIndexShop == -1) return message.channel.send('El usuario no tiene ese producto')
                let buyProducto = buyDbMencion.inventory.shop.productos.map(item => {
                    if (item.item == buyProductoAComprar) return item
                }).filter(Boolean)[0]

                const buyDbAuthor = await user.findOne({ userId: message.author.id })
                let buyMoneyAuthor = buyDbAuthor.money.efectivo
                if (buyProducto.price > buyMoneyAuthor) return message.channel.send('No tienes el dinero en efectivo suficiente para comprar ese producto')
                buyDbAuthor.money.efectivo -= buyProducto.price
                buyDbMencion.money.bank += buyProducto.price
                let buyIndexBagAuthor = buyDbAuthor.inventory.bag.findIndex(item => item.item == buyProductoAComprar)

                let buyBagItemAuthor = await buyDbAuthor.inventory.bag.map(item => {
                    if (item.item == buyProductoAComprar) return item
                }).filter(Boolean)[0]
                if (buyIndexBagAuthor == -1) {
                    buyDbAuthor.inventory.bag.push({ item: buyProductoAComprar, cantidad: 1 })
                } else {
                    buyDbAuthor.inventory.bag.splice(buyIndexBagAuthor, 1, { item: buyBagItemAuthor.item, cantidad: buyBagItemAuthor.cantidad + 1 })
                }
                buyDbMencion.inventory.shop.productos.splice(buyIndexShop, 1)
                buyDbMencion.inventory.shop.ventas.usuario = `${message.author.tag}(${message.author.id})`
                buyDbMencion.inventory.shop.ventas.producto = buyProductoAComprar
                buyDbMencion.inventory.shop.ventas.fecha = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`
                buyDbAuthor.inventory.shop.compras.producto = buyProductoAComprar
                buyDbAuthor.inventory.shop.compras.usuario = `${buyUsuMencion.tag}(${buyUsuMencion.id})`
                buyDbAuthor.inventory.shop.compras.fecha = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`
                message.channel.send(`Compraste ${buyProductoAComprar} por un precio de ${buyProducto.price}\$`)
                buyDbAuthor.save()
                buyDbMencion.save()
                break;
            case 'shell':
                let shellArgumentos = args
                let shellItemToShell = shellArgumentos.slice(1, args.length - 1).join(' ')
                if (!shellItemToShell) return message.channel.send('Debes especificar el item que quieres vender')
                const shellConfig = await user.findOne({ userId: message.author.id })
                let shellIndexBag = shellConfig.inventory.bag.findIndex(item => item.item == shellItemToShell)

                if (shellIndexBag == undefined || shellIndexBag == -1) return message.channel.send('Hmm al parecer no tienes ese objeto en tu mochila')
                let shellArgsPrice = args.pop()
                if (!shellArgsPrice) return message.channel.send('Debes ponerle un precio al producto')
                let shellPrecioProducto = parseInt(shellArgsPrice)
                if (isNaN(shellPrecioProducto)) return message.channel.send('El precio que especificaste es incorrecto')
                if (shellPrecioProducto > 1000) return message.channel.send('El precio no puede ser mayor a 1000')
                if (!shellPrecioProducto) return message.channel.send('Debes especificar un precio')
                let shellUsuShop = shellConfig.inventory.shop.productos
                if (shellUsuShop.length >= 10) return message.channel.send('Ya alcanzaste el maximo de productos en venta (x10)')

                let shellBagUsu = shellConfig.inventory.bag.map(item => { if(item.item == shellItemToShell) return item}).filter(Boolean)[0]
                if (shellBagUsu.cantidad <= 1) {
                    shellConfig.inventory.bag.splice(shellIndexBag, 1)
                } else {
                    shellConfig.inventory.bag.splice(shellIndexBag, 1, { item: shellItemToShell, cantidad: parseInt(shellBagUsu.cantidad) - 1 })
                }
                shellConfig.inventory.shop.productos.push({ item: shellItemToShell, price: shellPrecioProducto })
                let shelltiendaActualizada = shellConfig.inventory.shop.productos
                let shelltodoOK = shelltiendaActualizada.map(itemActializado => {
                    return `\`\`\`\nProducto: ${itemActializado.item}\nPrecio: ${itemActializado.price}\n\`\`\``
                }).join(' ')
                const embedTiendaActualizada = new Discord.MessageEmbed()
                    .setDescription(`Ok esta es tu tienda actualizada\n${shelltodoOK}`)
                    .setColor('RANDOM')
                message.channel.send(embedTiendaActualizada)
                shellConfig.save()
                break;
            case 'show':
                const embedShopShow = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                let usuMencion = message.mentions.users.first() || message.author
                if (usuMencion.bot) return message.channel.send('Los bots no pueden tener una tienda :(')
                const dbUsu = await user.findOne({ userId: usuMencion })
                let usuMencionShop = dbUsu.inventory.shop.productos
                if (!usuMencionShop.length) {
                    embedShopShow.setTitle(`Tienda de ${usuMencion.tag}`)
                    embedShopShow.setDescription(`El usuario ${usuMencion} no tiene ningun objeto a la venta`)
                    message.channel.send(embedShopShow)
                    return
                }
                embedShopShow.setTitle(`Tienda de ${usuMencion.tag}`)
                embedShopShow.setDescription(usuMencionShop.map(item => {
                    return `\`\`\`Producto: ${item.item}\nPrecio: ${item.price}\`\`\``
                }).join(' '))
                message.channel.send(embedShopShow)
                break;
            case 'cancel':
                let cancelProducto = args.slice(1).join(' ')
                if (!cancelProducto) return message.channel.send('Debes escribir un producto para quitar de la venta')
                const cancelDbAuthor = await user.findOne({ userId: message.author.id })
                let cancelIndexShop = cancelDbAuthor.inventory.shop.productos.findIndex(item => item.item == cancelProducto)

                if (cancelIndexShop == -1) return message.channel.send('No tienes ese producto a la venta')

                let cancelIndexBag = cancelDbAuthor.inventory.bag.findIndex(item => item.item == cancelProducto)

                if (cancelIndexBag == -1) {
                    cancelDbAuthor.inventory.bag.push({ item: cancelProducto, cantidad: 1 })
                    cancelDbAuthor.inventory.shop.productos.splice(cancelIndexShop, 1)
                } else {
                    let cancelBagAuthor = cancelDbAuthor.inventory.bag[cancelIndexBag]

                    cancelDbAuthor.inventory.bag.splice(cancelIndexBag, 1, { item: cancelBagAuthor.item, cantidad: cancelBagAuthor.cantidad + 1 })
                    cancelDbAuthor.inventory.shop.productos.splice(cancelIndexShop, 1)
                }
                message.channel.send(`El producto ${cancelProducto} se ha retirado corectamente`)
                cancelDbAuthor.save()
                break
            case 'open':
                const openDbAuthor = await user.findOne({ userId: message.author.id })
                let openShopOpen = openDbAuthor.inventory.shop.open
                if (openShopOpen) {
                    message.channel.send('Tu tienda ya esta abierta')
                } else {
                    openDbAuthor.inventory.shop.open = true
                    openDbAuthor.save()
                    message.reply('Abriste tu tienda!')
                }
                break;
            case 'close':
                const closeDbAuthor = await user.findOne({ userId: message.author.id })
                let closeShopOpen = closeDbAuthor.inventory.shop.open
                if (closeShopOpen) {
                    closeDbAuthor.inventory.shop.open = false
                    closeDbAuthor.save()
                    message.reply('Cerraste tu tienda!')
                } else {
                    message.channel.send('Tu tienda ya esta cerrada')
                }
                break;
            case 'info':
                let infoUsu = message.mentions.users.first() || message.author
                const infoDbUsu = await user.findOne({ userId: infoUsu.id })
                if (!infoDbUsu) return message.channel.send('hmm no tengo datos de el ususario')
                let infoVentasUsu = infoDbUsu.inventory.shop.ventas.usuario
                let infoVentasProducto = infoDbUsu.inventory.shop.ventas.producto
                let infoVentasFecha = infoDbUsu.inventory.shop.ventas.fecha
                if (infoVentasFecha == undefined) infoVentasFecha = 'No hay datos';
                let infoComprasUsu = infoDbUsu.inventory.shop.compras.usuario
                let infoComprasProducto = infoDbUsu.inventory.shop.compras.producto
                let infoComprasFecha = infoDbUsu.inventory.shop.compras.fecha
                const infoEmbed = new Discord.MessageEmbed()
                    .setTitle(`Informacion hacerca de las transacciones de ${infoUsu.tag}`)
                    .addField(`**Ventas**`, `*Ultimo usuario registrado:*\n👤 ${infoVentasUsu}\n*Ultimo producto registrado:*\n🏷 ${infoVentasProducto}\n*Ultima fecha registrada:*\n📆 ${infoVentasFecha}`, true)
                    .addField(`**Compras**`, `*Ultimo usuario registrado:*\n👤 ${infoComprasUsu}\n*Ultimo producto registrado:*\n🏷 ${infoComprasProducto}\n*Ultima fecha registrada:*\n📆 ${infoComprasFecha}`, true)
                    .setColor('RANDOM')
                    .setFooter(`Consultado por: ${message.author.tag}`, message.author.displayAvatarURL())
                message.channel.send(infoEmbed)
                break;
            default:
                message.channel.send('Esa accion no existe\nDebes especificar una accion para realizar asi \`buy\` \`shell\` \`show\` \`cancel\` \`open\` \`close\` \`info\`')
                break;
        }
    }
}