import IClient from "../@types/discord-client";
import { init as botInit } from "../commands/bot/index";
import { init as configInit } from "../commands/config/index";
import { init as economyInit } from "../commands/economy/index";
import { init as funInit } from "../commands/fun/index";
import { init as imageInit } from "../commands/image/index";
import { init as moderacionInit } from "../commands/moderacion/index";
import { init as utilityInit } from "../commands/utility/index";

export default new class commands_init {
    run = (client: IClient) => {
        botInit(client);
        configInit(client);
        economyInit(client);
        funInit(client);
        imageInit(client);
        moderacionInit(client);
        utilityInit(client);
        console.log(`Loaded ${client.commands.size} commands...`);
        return true;
    };
};
