const { strikethrough } = require('chalk')
const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    userId: {
        type: Number,
        required: true
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
            default: 'https://images2.alphacoders.com/103/1039991.jpg'
        },
        color: {
            type: String,
            default: '#3c50d4'
        }
    },
    inventory: {
        bag: Array,
        shop: {
            open: Boolean,
            ventas: {
                usuario: String,
                producto: String
            },
            compras: {
                usuario: String,
                producto: String,
                fecha: String
            },
            productos: Array
        }
    }
})

module.exports = mongoose.model('users', userSchema)