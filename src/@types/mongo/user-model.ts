import { Document } from "mongoose";

export default interface user_model extends Document {
    userId: string;
    money: {
        efectivo: number,
        bank: number;
    };
    xp: {
        actual: number,
        necesario: number,
        nivel: number,
        url: string,
        color: string;
    };
    inventory: {
        bag: Array<{
            item: string,
            cantidad: number;
        }>,
        shop: {
            open: boolean,
            ventas: {
                usuario: string,
                producto: string,
                fecha: Date;
            },
            compras: {
                usuario: string,
                producto: string,
                fecha: Date;
            },
            productos: Array<{
                item: string,
                price: number;
            }>;
        };
    };
}
