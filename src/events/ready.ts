import IClient from "../@types/discord-client";
import commandsDB from "../models/commands";

export default new class event_ready {
  name = 'ready';
  run = async (client: IClient) => {
    if (!client.user) {
      console.error("el usuario es indefinido!"); process.exit()
    }
    console.log(`El bot ${client.user.username} esta listo!`);
    setInterval(() => {
      var estados = [
        `guilds: ${client.guilds.cache.size}`,
        `version: ${require('../../package.json').version}`,
        `usuarios: ${client.users.cache.size}`
      ];
      var estadosRandom = Math.floor(Math.random() * estados.length);
      client.user.setPresence({
        status: "online",
        activity: {
          name: estados[estadosRandom],
          type: 'LISTENING'
        }
      });
    }, 10000);
    // await commandsDB.deleteMany()
    // let newCommands = new commandsDB({
    //   commands: client.commands.array(),
    //   categories: client.categoria.map(c => {
    //     const category = require(`../commands/${c}/index.json`);
    //     category.name = c;
    //     return category;
    //   })
    // });
    // await newCommands.save()
    // if (process.env.NODE_ENV != "production") require("../console")(client);
  }
}
