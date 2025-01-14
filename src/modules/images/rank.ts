import canvas, { registerFont } from 'canvas';
import { User } from 'discord.js';
import path from "path";

export default new class rankXpCardGenerator {
    async run(user: User, color: string, level: string, currentXP: number, neededXP: number, bg: string): Promise<Buffer> {
        registerFont(path.join(__dirname, "../../../sources/fonts/impact.ttf"), { family: "Custom Impact" });
        registerFont(path.join(__dirname, "../../../sources/fonts/Helvetica.ttf"), { family: "Helvetica" });
        const lienzo = canvas.createCanvas(934, 282);
        const ctx = lienzo.getContext('2d');
        let opacity = 0.5;
        var LBackground = await canvas.loadImage(bg);
        let avatar = await canvas.loadImage(user.displayAvatarURL({ dynamic: false, size: 1024, format: "png" }));
        let temp = lienzo.width - 250;

        ctx.fillStyle = "#23272A";
        ctx.save();
        ctx.beginPath();
        roundRect(ctx, 0, 0, 934, 282, 5, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(LBackground, 0, 0, 934, 282);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = "#090A0B";
        if (LBackground) ctx.globalAlpha = opacity;
        else ctx.globalAlpha = 0.1 * 100 / 10;
        roundRect(ctx, 24, 36, 886, 210, 10, true);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(122, 142, 84, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = "#090A0B";
        ctx.globalAlpha = 0.7;

        ctx.fillRect(38, 58, 168, 168);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(121, 142, 80, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 41, 62, 160, 160);
        ctx.restore();
        ctx.save();

        ctx.fillStyle = "#c9c9c9";
        ctx.globalAlpha = 0.5;
        roundRect(ctx, 258, 184, 632, 36, 24, true);
        ctx.restore();

        ctx.fillStyle = "#000000";
        ctx.globalAlpha = 0.8;
        roundRect(ctx, 256, 182, 636, 40, 25, true);
        ctx.restore();
        ctx.save();

        let widthXP = (currentXP * 615) / neededXP;
        if (widthXP > 615 - 18.5) widthXP = 615 - 18.5;

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.globalAlpha = 1;
        ctx.arc(257 + 20, 147.5 + 18.5 + 36.25, 18, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.fillRect(257 + 22, 147.5 + 36.25, widthXP, 35.9);
        ctx.arc(257 + 18.5 + widthXP, 147.5 + 18.5 + 36.25, 18, 0, Math.PI * 2, false);
        ctx.fill();

        var name = user.username.length > 15 ? user.username.substring(0, 17) + "..." : user.username;
        ctx.font = '40px Custom Impact';
        ctx.fillStyle = 'white';
        ctx.textAlign = "left";
        ctx.fillText(name, 260, 162);

        let left = ctx.measureText(name).width + 277;

        ctx.save();
        ctx.font = '25px Helvetica';
        ctx.fillStyle = '#7F8384';
        ctx.textAlign = "left";
        ctx.fillText(`#${user.discriminator}`, left, 162);
        ctx.restore();

        ctx.save();
        ctx.font = '25px Helvetica';
        ctx.fillStyle = 'white';
        ctx.textAlign = "left";
        ctx.fillText(`Nivel: ${level}`, temp, 99);
        ctx.restore();

        ctx.font = '25px Helvetica';
        ctx.fillStyle = 'white';
        ctx.textAlign = "left";
        ctx.fillText(currentXP.toString(), 707, 165);

        left = ctx.measureText(currentXP.toString()).width + 710;

        ctx.font = '25px Helvetica';
        ctx.fillStyle = '#7F8384';
        ctx.textAlign = "left";
        ctx.fillText(`/${neededXP} XP`, left, 165);

        return lienzo.toBuffer();
    }
};

function roundRect(ctx: canvas.CanvasRenderingContext2D,
    x: number, y: number, width: number, height: number,
    radius: number, fill: boolean, stroke?: boolean) {

    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    var radiusInfo = { tl: radius, tr: radius, br: radius, bl: radius };

    ctx.beginPath();
    ctx.moveTo(x + radiusInfo.tl, y);
    ctx.lineTo(x + width - radiusInfo.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radiusInfo.tr);
    ctx.lineTo(x + width, y + height - radiusInfo.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radiusInfo.br, y + height);
    ctx.lineTo(x + radiusInfo.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radiusInfo.bl);
    ctx.lineTo(x, y + radiusInfo.tl);
    ctx.quadraticCurveTo(x, y, x + radiusInfo.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}
