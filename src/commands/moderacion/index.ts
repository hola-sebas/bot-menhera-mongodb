import IClient from "../../@types/discord-client";
import ban from "./ban";
import kick from "./kick";

export function init(client: IClient): void {
    client.commands.set(ban.name, ban);
    client.commands.set(kick.name, kick);
    client.categories.set(categoryOptions.name, categoryOptions);
};

export var categoryOptions = {
    canDisable: false,
    name: __dirname.split(require('path').sep).pop(),
    description: "Comandos para moderar"
};
