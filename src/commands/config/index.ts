import IClient from "../../@types/discord-client";
import autoreply from "./autoreply";
import disable from "./disable";
import enable from "./enable";
import goodbye from "./goodbye";
import prefix from "./prefix";
import welcome from "./welcome";
import xpcard from "./xpcard";


export function init(client: IClient): void {
    client.commands.set(autoreply.name, autoreply);
    client.commands.set(disable.name, disable);
    client.commands.set(enable.name, enable);
    client.commands.set(goodbye.name, goodbye);
    client.commands.set(prefix.name, prefix);
    client.commands.set(welcome.name, welcome);
    client.commands.set(xpcard.name, xpcard);
    client.categories.set(categoryOptions.name, categoryOptions);
}
export var categoryOptions = {
    canDisable: false,
    name: __dirname.split(require('path').sep).pop(),
    description: "Configura todo lo que puedas a tu gusto"
};
