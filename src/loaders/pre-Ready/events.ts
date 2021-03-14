import ev_error from "../../events/error";
import ev_ready from "../../events/ready";
import ev_message from "../../events/message";
import ev_guildCreate from "../../events/guildCreate";
import ev_guildDelete from "../../events/guildDelete";
import ev_guildMemeberAdd from "../../events/guildMemberAdd";
import ev_guildMemberRemove from "../../events/guildMemberRemove";

import IClient from "../../@types/discord-client";

export default new class event_init {
    run = function (client: IClient): void {
        client.on(ev_ready.name, () => ev_ready.run(client));
        client.on(ev_error.name, (args) => ev_error.run(client, args));
        client.on(ev_message.name, (args) => ev_message.run(client, args));
        client.on(ev_guildCreate.name, (args) => ev_guildCreate.run(client, args));
        client.on(ev_guildDelete.name, (args) => ev_guildDelete.run(client, args));
        client.on(ev_guildMemeberAdd.name, (args) => ev_guildMemeberAdd.run(client, args));
        client.on(ev_guildMemberRemove.name, (args) => ev_guildMemberRemove.run(client, args));

        console.log(`Loaded ${client.eventNames().length} events...`);
    };
};
