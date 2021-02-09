import { Message, Guild } from 'discord.js';
import IClient from '../@types/discord-client';
import configFile from '../config';
import guild from '../models/guild';

export default async function (message: Message | { guild: Guild; }, client: IClient): Promise<void> {
    //iniciar servidor en la base de datos 
    let config = await guild.findOne({ guildId: message.guild?.id });
    if (config) return;
    const newGuild = new guild({
        guildId: message.guild?.id,
        configuracion: {
            prefix: configFile.prefix,
            comandosDesactivados: [],
            categoriasDesactivadas: []
        },
        mensajes: {
            autoReply: true,
            welcome: {
                img: 'https://menherachan.herokuapp.com/images/backgroundimage.jpg',
                message: 'Bienvenido al server',
                channel: '0'
            },
            goodbye: {
                message: 'Se fue de el server',
                channel: '0'
            }
        }
    });
    await newGuild.save();
    return;
}
