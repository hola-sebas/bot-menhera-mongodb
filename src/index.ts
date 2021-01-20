var comienzo = Date.now();
console.clear();
console.info(`Iniciando... \nen modo: ${process.env.NODE_ENV? process.env.NODE_ENV: "development"}`);
import Discord from "discord.js";
import config from "./config";
import connectDatabase from "./database";
import IClient from "./@types/discord-client";

// scrips initializators
import utils from "./scripts/processEvents";
import commands from "./scripts/commands";
import events from "./scripts/events";

const client = <IClient>new Discord.Client({ ws: { intents: 32767 } });
client.commands = new Discord.Collection();
client.categoria = new Map();
client.console = new Discord.Collection();


//Ejecucion de scripts
console.log("Ejecutando scripts\n");
try {
  utils.run();
  commands.run(client);
  events.run(client);
} catch (err) {
  console.error(`ERROR exit code 3: Se produjo un error inesperado mientras se cargaba el bot: \n`,  err);
  process.exit(3);
}
//Fin de la ejecucion de scripts

connectDatabase(() => {
  var fin = Date.now();

  console.log(`Cargado en ${fin - comienzo} ms\niniciando sesion en discord\n`);

  client.login(process.env.NODE_ENV == "production" ? config.token : config.devToken).then(() => {
    console.log("Sesion iniciada correctamente en discord")
  }).catch((err) => {
    console.error(`ERROR exit code 1: El token provicionado es invalido\nToken: ${config.token}\n\n${err}`);
    process.exit(1);
  });
});
