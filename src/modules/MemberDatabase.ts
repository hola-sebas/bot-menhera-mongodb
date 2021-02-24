import { IUser, interfaceUserModel } from '../@types/mongo/user-model';
import user from '../models/user';

/**
 * creates a member in the database if they not exists
 * @param userID
 */
export default async function (userID: string): Promise<interfaceUserModel> {
    let config = await user.findOne({ userID: userID });
    if (config) return config;
    const newUser = new user(<IUser>{
        userID: userID,
        money: {
            efectivo: 0,
            bank: 0
        },
        behavior: {
            score: 0,
            lastServerBanned: "0",
            lastServerKicked: "0",
            lastServerMuted: "0"
        },
        xp: {
            actual: 0,
            necesario: 100,
            nivel: 1,
            color: "#3c50d4",
            url: "https://cdn.discordapp.com/attachments/730211053710868503/809911071242584094/kVmklIMxm84.jpg"
        },
        inventory: {
            bag: [],
            shop: {
                open: false,
                ventas: {
                    usuario: 'No hay datos',
                    producto: 'No hay datos',
                    fecha: new Date()
                },
                compras: {
                    usuario: 'No hay datos',
                    producto: 'No hay datos',
                    fecha: new Date()
                },
                productos: []
            }
        }
    });

    return await newUser.save();
}
