import IClient from '../@types/discord-client';
import configFile from '../config';
import guild from '../models/guild';
import { guildInfo } from "../@types/mongo/guild-model";

export default async function (guildID: string, client: IClient): Promise<void> {
    //iniciar servidor en la base de datos 
    let config = await guild.findOne({ guildID });
    if (config) return;
    const newGuild = new guild(<guildInfo>{
        guildID: guildID,
        messages: {
            autoReply: true,
            goodbye: {
                channel: "0",
                message: "Se fue del servidor"
            },
            welcome:{
                channel: "0",
                message: "Bienvenido al servidor",
                img: "https://cdn.nekos.life/wallpaper/4bkrqTpaLYo.png"
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
        }
    });
    await newGuild.save();
    return;
}
