import IClient from "../@types/discord-client";

export default new class event_error {
    name = 'error';
    run(_client: IClient, error: any) {
        console.error(`an error occurred on the bot`, error);
    }
};
