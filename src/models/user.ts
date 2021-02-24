import { model, Schema } from 'mongoose';
import IUsers from "../@types/mongo/user-model";

const userSchema = new Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    money: {
        efectivo: Number,
        bank: Number
    },
    behavior: {
        score: Number,
        lastServerBanned: String,
        lastServerMuted: String,
        lastServerKicked: String
    },
    xp: {
        actual: Number,
        necesario: Number,
        nivel: Number,
        url: {
            type: String,
            default: 'https://cdn.discordapp.com/attachments/730211053710868503/809911071242584094/kVmklIMxm84.jpg'
        },
        color: {
            type: String,
            default: '#3c50d4'
        }
    },
    inventory: {
        bag: Array,
        shop: {
            open: {
                type: Boolean,
                default: false
            },
            ventas: {
                usuario: String,
                producto: String,
                fecha: Date
            },
            compras: {
                usuario: String,
                producto: String,
                fecha: Date
            },
            productos: Array
        }
    }
});

export default model<IUsers>('users', userSchema);
