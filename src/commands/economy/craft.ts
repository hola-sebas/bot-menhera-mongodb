'use strict';
import { categoryOptions } from './index';
import user from '../../models/user';
import Discord from "discord.js";
import { bot_commands, permissions } from '../../@types/bot-commands';

export default new class command_craft implements bot_commands {
    name = 'craft';
    description = 'Crea items para venderlos';
    usage = 'craft < item >';
    permissions: permissions[] = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES'];
    category = __dirname.split(require('path').sep).pop();
    disable = true;
    execute = async function (message: Discord.Message, args: string[]): Promise<void> {
        let itemCraft = args.join(' ')
        if (!itemCraft) {
            message.channel.send('Debes poner un item a craftear, inventate uno!');
            return;
        }
        if (!args[1]) {
            if (!isNaN(parseInt(args[0]))) {
                message.channel.send(`ok pero... ${parseInt(itemCraft)} que?`);
                return;
            }
        }
        if (itemCraft.length > 30) {
            message.channel.send('No puedes crear un item mayor a 30 caracteres');
            return;
        }

        let materiales: string[] = [];

        regexp.map(valor => {
            let indicador = args.join('').match(valor.regexp)
            if (indicador) {
                for (let i = 0; i < indicador.length; i++) {
                    materiales.push(valor.material)
                }
            }
        })
        if (await MatchMine(args[0])) {
            message.channel.send('Estas tratando de crear un mineral que se debe conseguir minando');
            return;
        };
        const config = await user.findOne({ userId: message.author.id })
        if (!config) return;
        let authorBag = config.inventory.bag;
        if (materiales.length) {
            message.channel.send(`Materiales necesarios \`${materiales.join(', ')}\` \nReacciona a ✅ para craftearlo o ❌ para cancelar`).then(msg => {
                msg.react('✅')
                msg.react('❌')
                const filtro = (reaction: Discord.MessageReaction, user: Discord.User) => {
                    return ["✅", "❌"].includes(reaction.emoji.name) && user.id === message.author.id;
                }
                msg.awaitReactions(filtro, { max: 1, time: 60000, errors: ['time'] }).catch(() => {
                    msg.edit('La creacion a sido cancelada ya que no se tomo una eleccion')
                }).then(async coleccion => {
                    if (!coleccion) return
                    const emoji = coleccion.first();
                    if (!emoji) return;
                    if (emoji?.emoji.name == '✅') {
                        let materialGastar: string[] = []
                        authorBag.map(item => {
                            materiales.map(material => {
                                if (item.item == material) {
                                    let number = materiales.indexOf(material);
                                    materialGastar.push(materiales[number]);
                                }
                            })
                        })
                        if (materiales.length) return msg.delete(), message.channel.send(`No tienes los materiales en tu mochila \nMateriales que te faltan: \`${materiales.join(', ')}\``)
                        authorBag.map(item => {
                            materialGastar.map(material => {
                                if (item.item == material) {
                                    let mapIndex = authorBag.findIndex(itemBag => itemBag.item == material)
                                    if (item.cantidad <= 1) {
                                        config.inventory.bag.splice(mapIndex, 1)
                                    } else {
                                        config.inventory.bag.splice(mapIndex, 1, { item: authorBag[mapIndex].item, cantidad: authorBag[mapIndex].cantidad - 1 })
                                    }
                                }
                            })
                        })
                        let indexBag = authorBag.findIndex(itemBag => itemBag.item == itemCraft)
                        if (indexBag == -1) {
                            config.inventory.bag.push({ item: itemCraft, cantidad: 1 })
                        } else {
                            config.inventory.bag.splice(indexBag, 1, { item: itemCraft, cantidad: authorBag[indexBag].cantidad + 1 })
                        }
                        config.save()
                        msg.delete()
                        message.channel.send(`Haz crafteado ${itemCraft}`)
                    }
                    if (emoji.emoji.name == '❌') {
                        msg.delete()
                        message.channel.send('Ok se cancela el crafteo')
                    }
                })
            })
        } else {
            message.channel.send(`Hmm no entiendo que objeto mistico quieres craftear asi que te voy a cobrar ${itemCraft.length}\$ \nReacciona a ✅ para craftearlo o ❌ para cancelar`).then(msg => {
                msg.react('✅')
                msg.react('❌')
                const filtro = (reaction: Discord.MessageReaction, user: Discord.User) => {
                    return ["✅", "❌"].includes(reaction.emoji.name) && user.id === message.author.id;
                }
                msg.awaitReactions(filtro, { max: 1, time: 60000, errors: ['time'] }).catch(() => {
                    msg.edit('La creacion a sido cancelada ya que no se tomo una eleccion')
                }).then(async coleccion => {
                    if (!coleccion) return
                    const emoji = coleccion.first();
                    if (!emoji) return;
                    if (emoji.emoji.name == '✅') {
                        let moneyAuthor = config.money.efectivo
                        if (itemCraft.length > moneyAuthor) return msg.delete(), message.channel.send(`No tienes ${itemCraft.length}\$ en efectivo`)
                        config.money.efectivo -= itemCraft.length
                        let indexBag = authorBag.findIndex(itemBag => itemBag.item == itemCraft)
                        if (indexBag == -1) {
                            config.inventory.bag.push({ item: itemCraft, cantidad: 1 })
                        } else {
                            config.inventory.bag.splice(indexBag, 1, { item: itemCraft, cantidad: authorBag[indexBag].cantidad + 1 })
                        }
                        config.save()
                        msg.delete()
                        message.channel.send(`Haz crafteado ${itemCraft}`)
                    }
                    if (emoji.emoji.name == '❌') {
                        msg.delete()
                        message.channel.send('Ok se cancela el crafteo')
                    }
                })
            })
        }
    }
}

/**
 * retorna true si encuntra alguna coincidencia 
 * undefined sin no la encuntra
 * @param {String} args string con la palabra a buscar
 */
async function MatchMine(craftitem: string) {
    let buscar: string[] = []
    categoryOptions.minerales.map(i => buscar.push(i.toLowerCase()))

    if (buscar.find(asd => asd == craftitem.toLowerCase())) {
        return true
    } else {
        return undefined
    }
}

let regexp = [
    {
        material: 'Hierro',
        regexp: /((h+)?(i+|!+)(e+|3+)(r+)?r+(o+|0+))|((i+|!+)r+(o+|0+)(n+)?)|(m+(e+|3+)t+(a+|4+)(l+|I+))/gimu
    },
    {
        material: 'Roca',
        regexp: /(p+(i+|l+)(e+|3+)d+r+(a+|4+))|(r+(o+|0+)c+(a+|4+))|(r+(o+|0+)c+(k+)?)|(s+(t+|7+)(o+|0+)n+(e+|3+)?)/gimu
    },
    {
        material: 'Azure',
        regexp: /((e+|3+)n+c+(a+|4+)n+t+(a+|4+)d+(o+|0+))|((e+|3+)n+c+h+(a+|4+)n+(t+|7+)((e+|3+)d+)?)/gimu
    },
    {
        material: 'Madera',
        regexp: /(p+(a+|4+)(l+|I+)(o+|0+))|(s+(t+|7+)(i+|l+)c+(k+)?)/gimu
    },
    {
        material: 'palo',
        regexp: /((e+|3+)s+p+(a+|4+)d+(a+|4+))|(s+w+(o+|0+)r+(d+)?)/gimu
    },
    {
        material: 'Diamante',
        regexp: /(d+(i+|l+)(a+|4+)m+(a+|4+)n+(t+|7+)(e+|3+))|(d+(i+|l+)(a+|4+)m+(o+|0+)n+d+)|((a+|4+)d+(a+|4+)m+(a+|4+)n+(t+|7+))/gimu
    },
    {
        material: 'Carbon',
        regexp: /(f+(o+|0+)g+(a+|4+)(t+|7+)(a+|4+))|(f+u+(e|3+)g+(o+|0+))|((a+|4+)n+(t+|7+)(o+|0+)r+c+h+(a+|4+))|((w+(o+|0+)d+)?(f+(i+|l+)r+(e+|3+)))|(t+(o+|0+)r+c+h+)/gimu
    },
    {
        material: 'Amatista',
        regexp: /((a+|4+)m+(a+|4+)t+(i+|l+)s+t+(a+|4+))/gimu
    },
    {
        material: 'Perla',
        regexp: /(m+(a+|4+)m+(a+|4+)d+((o+|0+)(a+|4+)))|(m+(a+|4+)m+(a+|4+)d+(i+|l+)s+(i+|l+)m+(o+|0+))/gimu
    }
]
