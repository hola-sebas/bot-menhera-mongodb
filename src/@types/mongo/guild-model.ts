import { Document } from "mongoose";

export interface guildModel extends Document, guildInfo { }

export default guildModel;

export interface guildInfo {
    guildID: string;
    config: {
        customCommands: Array<customCommand>;
        prefix: string;
        disabledCommands: Array<string>;
        disabledCategories: Array<string>;
        music: {
            DJChannels: Array<string>;
            DJRoles: Array<string>;
        };
    };
    messages: {
        autoReply: boolean;
        rankNotificationChannel: string;
        welcome: {
            img: string;
            message: string;
            channel: string;
        };
        goodbye: {
            message: string;
            channel: string;
        };
    };
    moderation: {
        logChannel: string;
        logEvents: Array<logEvents>;
        ignoreBots: boolean;
        autoAcctions: Array<autoModActions>;
        autoMod: {
            inappropriateWords: {
                ignnoredChannels: string[];
                ignnoredRoles: string[];
                action: autoModCategoryActions;
                inappropriateWordsList: string[];
            };
            invitationExternalGuilds: {
                ignnoredChannels: string[];
                ignnoredRoles: string[];
                action: autoModCategoryActions;
            };
            externalLinks: {
                ignnoredChannels: string[];
                ignnoredRoles: string[];
                action: autoModCategoryActions;
                discrodLinks: boolean;
                allowedDomains: string[];
            };
            tooManyCaps: {
                ignnoredChannels: string[];
                ignnoredRoles: string[];
                action: autoModCategoryActions;
            };
            tooManyEmojis: {
                ignnoredChannels: string[];
                ignnoredRoles: string[];
                action: autoModCategoryActions;
                emojiLimit: number;
            };
            tooManySpoiler: {
                ignnoredChannels: string[];
                ignnoredRoles: string[];
                action: autoModCategoryActions;
                spoilerLimit: number;
            };
            tooManyMentions: {
                ignnoredChannels: string[];
                ignnoredRoles: string[];
                action: autoModCategoryActions;
                mentionsLimit: number;
            };
            zalgo: {
                ignnoredChannels: string[];
                ignnoredRoles: string[];
                action: autoModCategoryActions;
            };
        };
    };
}

export interface autoModActions {
    action: "MUTE" | "BAN" | "KICK";
    infractionLimit: number;
}

export interface customCommand {
    name: string;
    description: string;
    cooldown: number;
    commandID: string;
    response: string;
}

export type autoModCategoryActions
    = "NONE"
    | "DELETE_MESSAGE"
    | "WARN_AUTHOR"
    | "DELETE_MESSAGE_WARN_USER";

export type logEvents
    // MOD EVENTS
    = "MEMBER_MUTED"
    | "MEMBER_UNMUTED"
    | "BANNED_BY_MODERATION"
    | "UNBANNED_BY_MODERATION"
    // MESSAGE EVENTS
    | "MESSAGE_UPDATED"
    | "MESSAGE_DELETED"
    | "INVITATION_SENT"
    // MEMBER EVENTS
    | "NICKNAME_CHANGED"
    | "MEMBER_BANNED"
    | "MEMBER_ADDED"
    | "MEMBER_DELETED"
    | "MEMBER_UNBANNED"
    | "USER_UPDATED"
    // ROL EVENTS
    | "NEW_ROL"
    | "UPDATED_ROL"
    | "DELETED_ROL"
    | "UPDATED_MEMBER_ROL"
    // VOICE EVENTS
    | "MEMBER_VOICE_JOINED"
    | "MEMBER_VOICE_LEAVE"
    // SERVER EVENTS
    | "SERVER_EDITED"
    | "EMOJIS_UPDATED"
    // CHANNEL EVENTS
    | "NEW_CHANNEL"
    | "UPDATED_CHANNEL"
    | "DELETED_CHANNEL";


