import fs from "fs";
import chalk from "chalk";
import IClient from "./@types/discord-client";

module.exports = (client: IClient) => {
    console.log([`${new Array(72).join("=")}\nConsola de ${client.user?.username} [Versión ${require('../package.json').version}]`,
    `\nCopyright (c) Daniel Alejandro Palma Garcia. Todos los derechos reservados.`].join());

    fs.readdirSync("./console").map(file => {
        const command = require(`./console/${file}`);
        if (command.name) {
            client.console.set(command.name, command);
        };
    });
    var oStdin = process.openStdin();
    oStdin.addListener("data", async data => {
        data = data.toString().trim();
        if (!data) return y();
        const args = data.slice().trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.console.get(commandName);
        if (!command) return console.log(chalk.hex('#FF8800')(`El comando ${commandName} no existe`)), y();
        await command.execute(client, chalk, args);
        y();
    })
    y();
}

function y() {
    process.stdout.write("->")
}
