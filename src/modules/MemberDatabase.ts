import { Message } from 'discord.js';
import IClient from '../@types/discord-client';
import user from '../models/user';

/**
 * creates a member in the database if they not exists
 * @param message 
 * @param client 
 */
export default async function (message: Message, client: IClient): Promise<void> {
    if (message.author.bot) return;
    let config = await user.findOne({ userID: message.author.id });
    if (config) return;
    const newUser = new user({
        userId: message.author.id,
        money: {
            efectivo: 0,
            bank: 0
        },
        xp: {
            actual: 0,
            necesario: 100,
            nivel: 1,
        },
        inventory: {
            bag: [],
            shop: {
                open: false,
                ventas: {
                    usuario: 'No hay datos',
                    producto: 'No hay datos'
                },
                compras: {
                    usuario: 'No hay datos',
                    producto: 'No hay datos'
                },
                productos: []
            }
        }
    });
    await newUser.save();
    return;
}
