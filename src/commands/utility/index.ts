import IClient from "../../@types/discord-client";
import avatar from "./avatar";
import channel from "./channel";
import help from "./help";
import hex from "./hex";
import say from "./say";


export function init(client: IClient): void {
    client.commands.set(avatar.name, avatar);
    client.commands.set(channel.name, channel);
    client.commands.set(help.name, help);
    client.commands.set(hex.name, hex);
    client.commands.set(say.name, say);
    client.categories.set(categoryOptions.name, categoryOptions);
}

export var categoryOptions = {
    canDisable: true,
    name: __dirname.split(require('path').sep).pop(),
    description: "algunos comandos utiles"
};
