module.exports = {
  name: 'ready',
  run: (client) => {
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
    // require("../console")(client);
  }
}