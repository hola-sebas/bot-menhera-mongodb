import IClient from "../@types/discord-client";
import { PresenceData } from "discord.js";

var ev = new class event_ready {
  name = 'ready';
  run = async (client: IClient) => {
    if (!client.user) {
      console.error("The bot user is undefined!");
      process.exit();
    }

    // ! bot presence
    setInterval(() => {
      client.user.setPresence({
        activity: states[statesCount],
        status: "online"
      });
      statesCount++;
      if (statesCount >= states.length) statesCount = 0;

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

    ];
    console.log(`The bot ${client.user.username} is ready!`);
  };
};


export default ev;
