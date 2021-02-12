import { Document } from "mongoose";


export default interface guild_model extends Document {
    guildID: string;
    configuracion: {
        prefix: string,
        comandosDesactivados: Array<string>,
        categoriasDesactivadas: Array<string>;
    };
    mensajes: {
        autoReply: boolean,
        welcome: {
            img: string,
            message: string,
            channel: string;
        },
        goodbye: {
            message: string,
            channel: string;
        };
    };
}
