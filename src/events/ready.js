const commandsDB = require("../models/commands");
module.exports = {
  name: 'ready',
  run: async (client) => {
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
    await commandsDB.deleteMany()
    let newCommands = new commandsDB({
      commands: client.commands.array()
    });
    await newCommands.save().then(console.log)
    if (process.env.NODE_ENV != "production") require("../console")(client);
  }
}