import { Schema, model } from 'mongoose';
import IGuild from "../@types/mongo/guild-model";
import config from "../config";

const guildSchema = new Schema({
    guildId: {
        type: String,
        unique: true
    },
    configuracion: {
        prefix: {
            type: String,
            default: config.prefix
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

export default model<IGuild>('guilds', guildSchema)
