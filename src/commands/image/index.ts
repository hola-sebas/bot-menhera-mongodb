import IClient from "../../@types/discord-client";
import angry from "./angry";
import blush from "./blush";
import bored from "./bored";
import confused from "./confused";
import cry from "./cry";
import dance from "./dance";
import feed from "./feed";
import greeting from "./greeting";
import happy from "./happy";
import hug from "./hug";
import kiss from "./kiss";
import sad from "./sad";
import waifu from "./waifu";
import wallpaper from "./wallpaper";


export function init(client: IClient): void {
    client.commands.set(angry.name, angry);
    client.commands.set(blush.name, blush);
    client.commands.set(bored.name, bored);
    client.commands.set(confused.name, confused);
    client.commands.set(cry.name, cry);
    client.commands.set(dance.name, dance);
    client.commands.set(feed.name, feed);
    client.commands.set(greeting.name, greeting);
    client.commands.set(happy.name, happy);
    client.commands.set(hug.name, hug);
    client.commands.set(kiss.name, kiss);
    client.commands.set(sad.name, sad);
    client.commands.set(waifu.name, waifu);
    client.commands.set(wallpaper.name, wallpaper);
    client.categories.set(categoryOptions.name, categoryOptions);
};

export var categoryOptions = {
    canDisable: true,
    name: __dirname.split(require('path').sep).pop(),
    description: "Imagenes para divertirse :D",
    waifus: ["https://i.pinimg.com/736x/4d/bd/d1/4dbdd1bd22ecb51c5de9de5934296b55.jpg",
        "https://somoskudasai.com/wp-content/uploads/2020/06/PS5-PS5chan-Artist-Illustrations-4-scaled.jpg",
        "https://i.pinimg.com/originals/f9/ae/7f/f9ae7f72948d65ff9883e56c2047c96d.png",
        "https://i.pinimg.com/originals/54/58/ac/5458ac2d07264d9c5b0f8960ed43b766.jpg",
        "https://i.pinimg.com/564x/c9/ff/93/c9ff93f1195c4aa507cb47e2ae87d86a.jpg",
        "https://i.pinimg.com/564x/fb/f7/a9/fbf7a92af75577e33a564ce490154c8f.jpg",
        "https://i.pinimg.com/564x/4e/37/02/4e37020a3e69f16cd04b246c2937b979.jpg",
        "https://i.pinimg.com/564x/aa/9a/77/aa9a77904007fe50a3af0207bd7b27b3.jpg",
        "https://i.pinimg.com/564x/9b/bf/1c/9bbf1c75222836f6278d771f18217fea.jpg",
        "https://i.pinimg.com/564x/9e/bb/77/9ebb77be96d6dd727a46b930264797be.jpg",
        "https://i.pinimg.com/564x/34/ed/17/34ed1783bb2ddd660686ac6a685270bf.jpg",
        "https://i.pinimg.com/564x/9b/df/03/9bdf03a1c82ef27b1b145424b3b78982.jpg",
        "https://i.pinimg.com/564x/e5/23/26/e52326f6399e93f10e4434eb0ba03708.jpg",
        "https://i.pinimg.com/564x/e0/a4/51/e0a451ae05121086bf3a3f476505d4c9.jpg",
        "https://i.pinimg.com/564x/c1/47/ca/c147ca4257be9528ad37796e1a7bb9a2.jpg",
        "https://i.pinimg.com/564x/e4/bd/2c/e4bd2c2597f3159e74b919aa5c4f60a3.jpg",
        "https://i.pinimg.com/564x/da/7d/67/da7d6763dceea989ba06355fe61d180d.jpg",
        "https://i.pinimg.com/originals/f1/34/93/f13493d78cde01c1325d2b253557523e.jpg",
        "https://i.pinimg.com/564x/0b/ae/25/0bae2596080bbe0aea8cfb5a479443ae.jpg",
        "https://i.pinimg.com/564x/df/35/2e/df352e1498722e21a7a36ce08e99438e.jpg",
        "https://i.pinimg.com/564x/fc/8d/45/fc8d4511b92f8ddbbe31817404fd3a12.jpg",
        "https://pbs.twimg.com/media/EMyfvEdU8AEIPvT.jpg"
    ]
};
