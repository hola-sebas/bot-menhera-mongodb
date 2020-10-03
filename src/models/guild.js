const mongoose = require('mongoose')
const { Schema } = mongoose

const guildSchema = new Schema({
    guildId: {
        type: String,
        unique: true
    },
    configuracion: {
        prefix: {
            type: String,
            default: require('../config.json').prefix
        },
        comandosDesactivados: Array,
        categoriasDesactivadas: Array
    },
    mensajes: {
        autoReply: Boolean,
        welcome: {
            img: String,
            message: String,
            channel: String
        },
        goodbye: {
            message: String,
            channel: String
        }
    }
})

module.exports = mongoose.model('guilds', guildSchema)