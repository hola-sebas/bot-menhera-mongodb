console.time("init time");
console.clear();
console.info(`Starting...\nMode: ${process.env.NODE_ENV ? process.env.NODE_ENV : "development"}`);
import Discord from "discord.js";
import config from "./config";
import connectDatabase from "./database";
import IClient from "./@types/discord-client";
import { init as iniTnaiClient } from "./tnai-client";

// scrips initializators
import utils from "./scripts/processEvents";
import commands from "./scripts/commands";
import events from "./scripts/events";

const client = <IClient>new Discord.Client({ ws: { intents: 32767 } });
client.commands = new Discord.Collection();
client.categories = new Map();


//Ejecucion de scripts
console.log("Executing scripts");
try {
  utils.run();
  commands.run(client);
  events.run(client);
} catch (err) {
  console.error(`ERROR exit code 3: Someting worng while starting bot: \n`, err);
  process.exit(3);
}
//Fin de la ejecucion de scripts 

connectDatabase(async () => {
  await iniTnaiClient();
  console.timeEnd("init time");
  console.log(`Logging in`);

  client.login(config.token).then(() => {
    console.log("Session successfully started on discord");
  }).catch((err) => {
    console.error(`ERROR exit code 1: an error occurred with the login\nToken: ${config.token}`, err);
    process.exit(1);
  });
});
