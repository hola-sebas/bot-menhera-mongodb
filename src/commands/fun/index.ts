import IClient from "../../@types/discord-client";
import ball from "./8bal";
import batslap from "./batslap";
import chiste from "./chiste";
import gay from "./gay";
import meme from "./meme";
import trash from "./trash";
import triggered from "./triggered";
import wanted from "./wanted";

export function init(client: IClient): void {
    client.commands.set(ball.name, ball);
    client.commands.set(batslap.name, batslap);
    client.commands.set(chiste.name, chiste);
    client.commands.set(gay.name, gay);
    client.commands.set(meme.name, meme);
    client.commands.set(trash.name, trash);
    client.commands.set(triggered.name, triggered);
    client.commands.set(wanted.name, wanted);
    client.categoria.set(categoryOptions.name, categoryOptions);
};

export var categoryOptions = {
    canDisable: true,
    name: __dirname.split(require('path').sep).pop(),
    description: "Diviertete un poco"
};
