import IClient from "../@types/discord-client";
import { PresenceData } from "discord.js";

var ev = new class event_ready {
  name = 'ready';
  run = async (client: IClient) => {
    if (!client.user) {
      console.error("el usuario es indefinido!");
      process.exit();
    }

    // ! bot presence
    setInterval(() => {
      client.user.setPresence({
        activity: states[statesCount],
        status: "online"
      });
      statesCount++;
      if(statesCount >= states.length) statesCount = 0;

    }, 15000);
    var statesCount = 0;
    var states: PresenceData["activity"][] = [
      {
        name: "nueva pagina :D",
        type: "WATCHING",
        url: "https://menherachan.herokuapp.com",
      },
      {
        name: `${client.users.cache.size} Usuarios`,
        type: "WATCHING"
      },
      {
        name: `${client.guilds.cache.size} Servidores`,
        type: "WATCHING"
      },
      {
        name: `${client.channels.cache.size} Canales`,
        type: "WATCHING"
      },

    ]
    console.log(`El bot ${client.user.username} esta listo!`);
  }
}


export default ev;
