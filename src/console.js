const fs = require("fs");
const chalk = require("chalk");

module.exports = (client) => {
    console.log(`=========================================================================
Consola de ${client.user.username} [Versión ${require('../package.json').version}]
Copyright (c) Daniel Alejandro Palma Garcia. Todos los derechos reservados.`);

    fs.readdirSync("./console").map(file => {
        const command = require(`./console/${file}`);
        if (command.name) {
            client.console.set(command.name, command);
        };
    });
    var consola = process.openStdin();
    consola.addListener("data", async d => {
        var data = d.toString().trim();
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