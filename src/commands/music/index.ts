import { DMChannel, Message, NewsChannel, StreamDispatcher, TextChannel, VoiceChannel, VoiceConnection } from "discord.js";
import { YouTubeSearchResults } from "youtube-search";
import ytdl from "ytdl-core";

import command_play from "./play";
import command_skip from "./skip";
import command_stop from "./stop";
import command_pause from "./pause";
import command_queue from "./queue";
import command_resume from "./resume";

import IClient from "../../@types/discord-client";

export function init(client: IClient): void {
    client.commands.set(command_play.name, command_play);
    client.commands.set(command_skip.name, command_skip);
    client.commands.set(command_stop.name, command_stop);
    client.commands.set(command_pause.name, command_pause);
    client.commands.set(command_queue.name, command_queue);
    client.commands.set(command_resume.name, command_resume);
    client.categories.set(categoryOptions.name, categoryOptions);
};

export var categoryOptions = {
    canDisable: true,
    name: __dirname.split(require('path').sep).pop(),
    description: "Mucha, mucha musica :D"
};


// song manager
export var musicManager = new class Music_Manager {
    guilds: Map<string, Server_QueueInfo> = new Map();
};

export class Server_QueueInfo {
    public client: IClient;
    public message: Message;
    public Voice_Channel?: VoiceChannel | null;
    public Text_Channel: TextChannel | DMChannel | NewsChannel;

    public volume: number = 100;
    public playing: boolean = false;
    public nowPlaying?: string | null = null;
    public queue: YouTubeSearchResults[] = [];
    public voice_connection?: VoiceConnection | null = null;
    public dispatchConnection?: StreamDispatcher | null = null;

    constructor(message: Message, client: IClient) {
        this.client = client;
        this.message = message;
        this.Text_Channel = message.channel;
        this.Voice_Channel = message.member?.voice.channel;
    }

    public async play(result: YouTubeSearchResults): Promise<void> {
        if (!this.client.voice?.connections.get(this.Voice_Channel?.id || "")) {
            this.voice_connection = await this.Voice_Channel?.join();
            this.VoiceConnectionslListeners();
        }
        if (this.nowPlaying || this.queue.length) {
            this.queue.push(result);
            this.Text_Channel.send(`Cancion (${result.title}) añadida a la cola!`);
            return;
        }
        this.dispatchConnection = this.voice_connection?.play(ytdl(result.link));
        this.playing = true;
        this.nowPlaying = result.title;
        this.dipatchConnectionLiteners();
    }

    public dipatchConnectionLiteners() {
        this.dispatchConnection?.on("finish", () => {
            this.nextSong();
        });
        this.dispatchConnection?.on("error", (err) => {
            if (/input stream: Premieres in ([0-9])+ (hours|days|seconds)/g.test(err.message)) {
                this.Text_Channel.send("Lo siento pero el video es de estreno");
                return;
            }
            this.Text_Channel.send(`Oh no hubo un error al intentar reproducir: **${this.nowPlaying}**`);
            process.env.NODE_ENV != "production" ? console.error(err) : null;
            this.nextSong();
        });
    }

    public VoiceConnectionslListeners() {
        this.voice_connection?.on("disconnect", () => {
            musicManager.guilds.delete(this.message.guild?.id || "");
        });
        this.voice_connection?.on("error", (err) => {
            this.Text_Channel.send("Oh no hubo un error al connectar al canal de voz, revisa mis permisos o vuelve a intentarlo mas tarde");
            console.error("An error ocurred in voice channel", err);
        });
    }

    public nextSong() {
        this.playing = false;
        this.nowPlaying = null;

        if (this.queue.length) {
            if (!((this.Voice_Channel?.members.size || 1) - 1)) {
                this.Text_Channel.send("No hay nadie en el canal de voz, desconectandome");
                this.voice_connection?.disconnect();
                return;
            }
            var nextSong = this.queue.shift();
            this.dispatchConnection = this.voice_connection?.play(ytdl(nextSong?.link || ""));
            this.nowPlaying = nextSong?.title;
            this.playing = true;
            this.Text_Channel.send(`Ahora reproduciendo: **${this.nowPlaying}**`);
            this.dipatchConnectionLiteners();
        } else {
            this.Text_Channel.send("No hay mas canciones en la cola de reproduccion, desconectandome...");
            this.voice_connection?.disconnect();
        }
    }
}
