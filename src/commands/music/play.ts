import { bot_commands, permissions } from "../../@types/bot-commands";
import YTSearch, { YouTubeSearchOptions } from "youtube-search";
import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import { decode as htmlDecode } from "html-entities";

import config from "../../config";
import { musicManager, Server_QueueInfo } from "./index";
import IClient from "../../@types/discord-client";

var YTopts: YouTubeSearchOptions = {
    key: config.YTAPIKEY,
    maxResults: 10,
    type: "video",
    safeSearch: "none"
};

export default new class command_search implements bot_commands {
    name = "play";
    description = "Busca una cancion para darle al play :D";
    cooldown = 30;
    aliases = ["buscar"];
    permissions: permissions[] = ["CONNECT", "SPEAK", "SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS", "VIEW_CHANNEL"];
    usage = "play <query | YouTube link>";
    category = __dirname.split(require('path').sep).pop();
    disable = true;

    async execute(message: Message, args: string[], client: IClient): Promise<any> {
        var queueInfo = musicManager.guilds.get(message.guild?.id || "");
        if (queueInfo && queueInfo.Text_Channel.id !== message.channel.id) {
            message.channel.send(`Este comando esta desabilitado en este canal mientras haya cola de reproduccion en el servidor, por favor usalo en <#${queueInfo.Text_Channel.id}>`);
            return false;
        }
        if (queueInfo && !queueInfo.Voice_Channel?.members.has(message.author.id)) {
            message.channel.send("Debes de estar en el canal de voz en donde se esta reproduciendo la cancion actual");
            return false;
        }
        if (!message.member?.voice.channel) {
            message.channel.send("Debes unirte a un canal de voz para poder saber donde puedo reproducir el video");
            return false;
        }
        if (!args.length) {
            message.channel.send("Debes poner algo para buscar!");
            return false;
        };
        var YTResults = await YTSearch(args.join(" "), YTopts);

        if (!YTResults.results.length) {
            message.channel.send(`No encontre ningun resultado con: **${args.join(" ")}**`);
            return false;
        }

        var YTResultsEmbed = new MessageEmbed()
            .setTitle(`Resultados de: ${args.join(" ")}`)
            .addFields(YTResults.results.map((result, index) => {
                YTResults.results[index].description = htmlDecode(YTResults.results[index].description, { level: "html5" });
                YTResults.results[index].title = htmlDecode(YTResults.results[index].title, { level: "html5" });
                return {
                    name: `${index}. ${result.title}`,
                    value: result.description || "No hay descripcion..."
                };
            }))
            .setColor("RANDOM");
        message.channel.send(YTResultsEmbed).then((msg) => {
            var emojisAray = ["0️⃣", "1️⃣",
                "2️⃣", "3️⃣",
                "4️⃣", "5️⃣",
                "6️⃣", "7️⃣",
                "8️⃣", "9️⃣"];
            emojisAray = YTResults.results.map((_value, index) => {
                msg.react(emojisAray[index]);
                return emojisAray[index];
            });
            const filter = (reaction: MessageReaction, user: User) => {
                return emojisAray.includes(reaction.emoji.name) && user.id === message.author.id;
            };
            msg.awaitReactions(filter, { errors: ["time"], time: 60000, max: 1 }).then((collection) => {
                if (!collection) return;
                var reaccion = collection.first();
                if (!reaccion) return;
                var ReactionArrayIndex = emojisAray.findIndex((value) => value == reaccion?.emoji.name);
                if (!queueInfo) {
                    var newQueueInfo = new Server_QueueInfo(message, client);
                    musicManager.guilds.set(message.guild?.id || "", newQueueInfo);
                    newQueueInfo.play(YTResults.results[ReactionArrayIndex]);
                } else {
                    queueInfo.play(YTResults.results[ReactionArrayIndex]);
                }
                var embedResults = new MessageEmbed()
                    .addField(YTResults.results[ReactionArrayIndex].title,
                        YTResults.results[ReactionArrayIndex].description || "No descripcion...")
                    .setColor("RANDOM");
                msg.edit(embedResults);
                msg.reactions.removeAll().catch();
            }).catch(() => {
                msg.edit(new MessageEmbed().setColor("RANDOM").setDescription("No seleccionaste una opcion"));
            });
        });
    }
};
