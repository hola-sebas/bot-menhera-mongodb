import { Schema, model } from 'mongoose';
import IGuild, { guildInfo } from "../@types/mongo/guild-model";

const guildSchema = new Schema({
    guildID: {
        type: String,
        unique: true
    },
    config: {
        customCommands: Array,
        prefix: String,
        disabledCommands: Array,
        disabledCategories: Array,
        music: {
            DJChannels: Array,
            DJRoles: Array
        }
    },
    messages: {
        autoReply: Boolean,
        rankNotificationChannel: String,
        welcome: {
            img: String,
            imgMessage: String,
            sendImage: Boolean,
            message: String,
            channel: String
        },
        goodbye: {
            message: String,
            channel: String
        }
    },
    moderation: {
        logChannel: String,
        logEvents: Array,
        ignoreBots: Boolean,
        autoAcctions: Array,
        autoMod: {
            inappropriateWords: {
                ignnoredChannels: Array,
                ignnoredRoles: Array,
                action: String,
                inappropriateWordsList: Array
            },
            invitationExternalGuilds: {
                ignnoredChannels: Array,
                ignnoredRoles: Array,
                action: String
            },
            externalLinks: {
                ignnoredChannels: Array,
                ignnoredRoles: Array,
                action: String,
                discrodLinks: Boolean,
                allowedDomains: Array
            },
            tooManyCaps: {
                ignnoredChannels: Array,
                ignnoredRoles: Array,
                action: String
            },
            tooManyEmojis: {
                ignnoredChannels: Array,
                ignnoredRoles: Array,
                action: String,
                emojiLimit: Number
            },
            tooManySpoiler: {
                ignnoredChannels: Array,
                ignnoredRoles: Array,
                action: String,
                spoilerLimit: Number
            },
            tooManyMentions: {
                ignnoredChannels: Array,
                ignnoredRoles: Array,
                action: String,
                mentionsLimit: Number
            },
            zalgo: {
                ignnoredChannels: Array,
                ignnoredRoles: Array,
                action: String
            }
        }
    }
});

export default model<IGuild>('guilds', guildSchema);
