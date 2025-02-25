import { loadImage, createCanvas, registerFont } from 'canvas';
import { User } from 'discord.js';
import { join } from "path";

export default new class welcomeCardGenerator {
    async run(member: User, fondo: string, welcomeMessage: string): Promise<Buffer> {
        registerFont(join(__dirname, "../../../sources/fonts/impact.ttf"), { family: "Custom Impact" });
        registerFont(join(__dirname, "../../../sources/fonts/Helvetica.ttf"), { family: "Helvetica" });
        const lienzo = createCanvas(1600, 720);
        const ctx = lienzo.getContext('2d');
        const background = await loadImage(fondo);

        ctx.drawImage(background, 0, 0, lienzo.width, lienzo.height);

        ctx.font = "30px Helvetica";
        ctx.fillStyle = "#FFFF";
        ctx.textAlign = "center";
        ctx.fillText(welcomeMessage.replace(/{user}/g, member.username),
            lienzo.width / 2,
            (lienzo.height / 2) + (lienzo.height / 2 / 2) + (lienzo.height / 2 / 2 / 2) + (lienzo.height / 2 / 2 / 2 / 2));

        ctx.font = '90px Custom Impact';
        ctx.fillStyle = '#ffff';
        ctx.textAlign = 'center';
        ctx.fillText(`Bienvenido`, lienzo.width / 2, (lienzo.height / 2) + (lienzo.height / 2 / 2));

        const radio = 170;
        const x = lienzo.width / 2 - radio;
        const y = lienzo.height / 2 - (radio * 2);

        ctx.beginPath();
        ctx.arc(x + radio, y + radio, radio + 5, 0, Math.PI * 2, true);
        ctx.fillStyle = "#090A0B";
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.save();
        ctx.beginPath();
        ctx.arc(x + radio, y + radio, radio, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(background, 0, 0, lienzo.width, lienzo.height);

        const userAvatar = await loadImage(member.displayAvatarURL({ dynamic: false, size: 256, format: "png" }));
        ctx.globalAlpha = 1;
        ctx.drawImage(userAvatar, x, y, radio * 2, radio * 2);

        return lienzo.toBuffer();
    }
};
