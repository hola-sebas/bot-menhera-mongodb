import { model, Schema } from 'mongoose';
import IUsers from "../@types/mongo/user-model";

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    money: {
        efectivo: Number,
        bank: Number
    },
    xp: {
        actual: Number,
        necesario: Number,
        nivel: Number,
        url: {
            type: String,
            default: 'https://menherachan.herokuapp.com/images/backgroundimage.jpg'
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
})

export default model<IUsers>('users', userSchema);