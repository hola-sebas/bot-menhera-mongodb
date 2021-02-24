import { Schema, model } from 'mongoose';
import IGuild from "../@types/mongo/guild-model";
import config from "../config";

const guildSchema = new Schema({
    guildID: {
        type: String,
        unique: true
    },
    messages: {
        autoReply: Boolean,
        goodbye: {
            channel: String,
            message: String
        },
        welcome: {
            img: String,
            imgMessage: String,
            sendImage: Boolean,
            channel: String,
            message: String,
        }
    },
    config: {
        prefix: {
            type: String,
            default: config.prefix
        },
        customCommands: Array,
        disabledCategories: Array,
        disabledCommands: Array,
        moderation: {
            logChannel: String,
            logEvents: Array
        },
        music: {
            DJChannels: Array,
            DJRoles: Array
        }
    }
});

export default model<IGuild>('guilds', guildSchema);
