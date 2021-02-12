import IClient from "../../@types/discord-client";
import bag from "./bag";
import balance from "./balance";
import craft from "./craft";
import deposit from "./deposit";
import mine from "./mine";
import profile from "./profile";
import rob from "./rob";
import shop from "./shop";
import use from "./use";
import withdraw from "./withdraw";
import work from "./work";
import xp from "./xp";

export function init(client: IClient): void {
    client.commands.set(bag.name, bag);
    client.commands.set(balance.name, balance);
    client.commands.set(craft.name, craft);
    client.commands.set(deposit.name, deposit);
    client.commands.set(mine.name, mine);
    client.commands.set(profile.name, profile);
    client.commands.set(rob.name, rob);
    client.commands.set(shop.name, shop);
    client.commands.set(use.name, use);
    client.commands.set(withdraw.name, withdraw);
    client.commands.set(work.name, work);
    client.commands.set(xp.name, xp);
    client.categories.set(categoryOptions.name, categoryOptions);
};

export var categoryOptions = {
    canDisable: true,
    name: __dirname.split(require('path').sep).pop(),
    description: "Maneja el dinero a tu gusto",
    minerales: [
        "Roca", "Roca", "Roca", "Roca",
        "Roca", "Roca", "Diamante", "Hierro",
        "Hierro", "Hierro", "Hierro", "Madera",
        "Madera", "Madera", "Madera", "Madera",
        "Madera", "Madera", "Madera", "Madera",
        "Madera", "Madera", "Madera", "Madera",
        "Madera", "Madera", "Madera", "Madera",
        "Madera", "Madera", "Madera", "Carbon",
        "Carbon", "Carbon", "Carbon", "Carbon",
        "Carbon", "Carbon", "Azure", "Amatista",
        "Perla", "Azure", "Amatista", "Perla",
        "Carbon", "Carbon", "Roca", "Roca"
    ],
    trabajos: ["Trabajaste como mi chofer de uber",
        "Trabajaste como tendero en mi bar",
        "Trabajaste vendiendo pizzas por domicilio",
        "Fuiste mensajero pero te chocaste con un taxi y tuviste que pagar para que lo arreglen"
    ],
    robos: ["Otra vez robando que triste",
        "le robaste la cartera a tu madre que diria ella",
        "Robaste un banco! :O"
    ]
};
