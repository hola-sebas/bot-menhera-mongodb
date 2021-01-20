import IClient from "../@types/discord-client";

export default new class event_error {
    name = 'error';
    run(_client: IClient, error: any) {
        console.error(`Ocurrio un error \n`, error);
    }
}
