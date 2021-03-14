import IClient from "../@types/discord-client";
import presenceLoader from "../loaders/post-Ready/presence";
import radioManager from "../loaders/post-Ready/radio-manager";

export default new class event_ready {
  name = 'ready';
  async run(client: IClient) {
    if (!client.user) {
      console.error("The bot user is undefined!");
      process.exit();
    }
    // execution modules post-ready
    await presenceLoader(client);
    await radioManager.createBoardCast(client);
    console.log(`The bot ${client.user.username} is ready!`);
  };
};
