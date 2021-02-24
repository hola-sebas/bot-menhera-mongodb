import { Document } from "mongoose";

export interface interfaceUserModel extends Document, IUser { }

export default interfaceUserModel;

export interface IUser {
    userID: string;
    money: {
        efectivo: number;
        bank: number;
    };
    xp: {
        actual: number;
        necesario: number;
        nivel: number;
        url: string;
        color: string;
    };
    behavior: {
        score: number;
        lastServerBanned: string;
        lastServerMuted: string;
        lastServerKicked: string;
    };
    inventory: {
        bag: Array<itemsBag>;
        shop: {
            open: boolean;
            ventas: {
                usuario: string;
                producto: string;
                fecha: Date;
            };
            compras: {
                usuario: string;
                producto: string;
                fecha: Date;
            };
            productos: Array<itemsShop>;
        };
    };
}

export interface itemsBag {
    item: string;
    cantidad: number;
}

export interface itemsShop {
    item: string;
    price: number;
}
