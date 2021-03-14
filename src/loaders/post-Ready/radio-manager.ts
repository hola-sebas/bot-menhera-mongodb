import { VoiceBroadcast } from "discord.js";
import IClient from "../../@types/discord-client";
import MusciArrayJSON from "./radio-musics.json";
import YTSearch, { YouTubeSearchOptions, YouTubeSearchResults } from "youtube-search";
import config from "../../config";

var YTopts: YouTubeSearchOptions = {
    key: config.YTAPIKEY,
    maxResults: 10,
    type: "video",
    safeSearch: "none"
};


export default new class BotRadioManager {
    boardcast: VoiceBroadcast | null = null;
    indexCurrentSong: number | null = null;
    currentSong: YouTubeSearchResults | null = null;
    createBoardCast(client: IClient) {
        if (!client.voice) {
            console.log("the voice client is undefined");
            process.exit(1);
        }
        this.boardcast = client.voice?.createBroadcast();
        this.changeSong();
    }
    async changeSong() {
        var currentSongNumber = Math.floor(Math.random() * MusciArrayJSON.length);
        if (currentSongNumber == this.indexCurrentSong) {
            this.changeSong();
            return;
        };
        var nextSong = MusciArrayJSON[currentSongNumber];
        var YTResultSong = await YTSearch(nextSong, YTopts);
        if(!YTResultSong.results.length){
            this.changeSong();
            return;
        }
    }
};
