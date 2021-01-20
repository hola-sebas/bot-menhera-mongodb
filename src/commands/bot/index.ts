import bugreport from "./bugreport";
import donate from "./donate";
import ping from "./ping";
import stats from "./stats";
import IClient from "../../@types/discord-client";


export function init(client: IClient): void {
    client.commands.set(bugreport.name, bugreport);
    client.commands.set(donate.name, donate);
    client.commands.set(ping.name, ping);
    client.commands.set(stats.name, stats);
    client.categoria.set(categoryOptions.name, categoryOptions);
}

export var categoryOptions = {
    canDisable: true,
    name: __dirname.split(require('path').sep).pop(),
    description: "Información hacerca de mi :)"
};
