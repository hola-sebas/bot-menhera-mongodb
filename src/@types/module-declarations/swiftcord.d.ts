declare module "swiftcord" {
    export class Canvas {
        batslap(avatarURL1: string, avatarURL2: string): Promise<Buffer>;
        gay(avatarURL: string): Promise<Buffer>;
        delete(avatarURL: string): Promise<Buffer>;
        trigger(avatarURL: string): Promise<Buffer>;
        wanted(avatarURL: string): Promise<Buffer>;
        color(avatarURL: string): Promise<Buffer>;
    }
}
