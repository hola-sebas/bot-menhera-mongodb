const fs = require('fs')
const user = require('../../models/user')
const Discord = require('discord.js')
module.exports = {
    name: 'profile',
    description: 'Muestra tu perfil',
    usage: 'profile <@usuario>',
    aliases: ['perfil'],
    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
    category: __dirname.split('\\').pop(),
    disable: true,

    execute: async (message, args) => {
        let usu = message.mentions.users.first() || message.author
        const config = await user.findOne({ userId: usu.id })
        if (!config) return message.channel.send('hmm no trengo datos de este usuario')
        let efectivo = config.money.efectivo
        let banco = config.money.bank
        let xpActual = config.xp.actual
        let xpNesesario = config.xp.necesario
        let xpNivel = config.xp.nivel
        let invBag = config.inventory.bag
        let invShopOpen = config.inventory.shop.open
        let invShopVen = config.inventory.shop.ventas
        let invShop = config.inventory.shop.productos
        if (!invBag.length) {
            invBag = 'No hay items'
        } else {
            invBag = invBag.map(item => {
                return `${item.item} (x${item.cantidad})`
            }).join(', ')
        }
        if (!invShop.length) {
            invShop = 'No hay items'
        } else {
            invShop = invShop.map(item => {
                return `${item.item} ${item.price}\$`
            }).join('\n')
        }
        const embedProfile = new Discord.MessageEmbed()
            .setThumbnail(usu.displayAvatarURL({ size: 1024 }))
            .setColor('RANDOM')
            .setTitle(`Perfil de ${usu.username}`)
            .addField('💰 Dinero: ', `Efectivo: ${efectivo}\nBanco: ${banco}`, true)
            .addField(`✨ XP:`, `Nivel actual: ${xpNivel}\nXp actual: ${xpActual} / ${xpNesesario}`, true)
            .addField('🎒 Inventario: ', `\`\`\`${invBag}\`\`\``)
            .addField('🏪 Shop: ', `**Open:** ${invShopOpen}\n**Ultimo usuario al que vendiste:** ${invShopVen.usuario}\n**Ultimo producto vendido:** ${invShopVen.producto}`, true)
            .addField('💸 Productos en venta:', `\`\`\`${invShop}\`\`\``)
        message.channel.send(embedProfile)
    }
}