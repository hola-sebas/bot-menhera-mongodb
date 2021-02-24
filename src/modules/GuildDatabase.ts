import configFile from '../config';
import guild from '../models/guild';
import { guildInfo, interfaceGuildModel} from "../@types/mongo/guild-model";

/**
 * creates a guild in the database if they not exists
 * @param guildID
 */
export default async function (guildID: string): Promise<interfaceGuildModel> {
    let config = await guild.findOne({ guildID });
    if (config) return config;
    const newGuild = new guild(<guildInfo>{
        guildID: guildID,
        messages: {
            autoReply: true,
            rankNotificationChannel: "0",
            goodbye: {
                channel: "0",
                message: "Se fue del servidor"
            },
            welcome: {
                channel: "0",
                message: "Bienvenido al servidor",
                img: "https://cdn.nekos.life/wallpaper/4bkrqTpaLYo.png",
                imgMessage: "Bienvenido {user} espero que sea de tu agrado el servidor",
                sendImage: true
            }
        },
        config: {
            prefix: configFile.prefix,
            customCommands: [],
            disabledCategories: [],
            disabledCommands: [],
            moderation: {
                logChannel: "0",
                logEvents: []
            },
            music: {
                DJChannels: [],
                DJRoles: []
            }
        },
        moderation: {
            ignoreBots: true,
            logChannel: "0",
            autoAcctions: [],
            logEvents: [],
            autoMod: {
                externalLinks: {
                    action: "NONE",
                    allowedDomains: [],
                    ignnoredChannels: [],
                    discrodLinks: false,
                    ignnoredRoles: []
                },
                inappropriateWords: {
                    action: "NONE",
                    ignnoredChannels: [],
                    ignnoredRoles: [],
                    inappropriateWordsList: []
                },
                invitationExternalGuilds: {
                    action: "NONE",
                    ignnoredChannels: [],
                    ignnoredRoles: []
                },
                tooManyCaps: {
                    action: "NONE",
                    ignnoredChannels: [],
                    ignnoredRoles: []
                },
                tooManyEmojis: {
                    action: "NONE",
                    ignnoredChannels: [],
                    ignnoredRoles: [],
                    emojiLimit: 10
                },
                tooManyMentions: {
                    action: "NONE",
                    ignnoredChannels: [],
                    ignnoredRoles: [],
                    mentionsLimit: 5
                },
                tooManySpoiler: {
                    action: "NONE",
                    ignnoredChannels: [],
                    ignnoredRoles: [],
                    spoilerLimit: 10
                },
                zalgo: {
                    action: "NONE",
                    ignnoredChannels: [],
                    ignnoredRoles: []
                }
            }
        }
    });
    
    return await newGuild.save();
}
