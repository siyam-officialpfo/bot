const { createCanvas, loadImage } = require("canvas");
const os = require("os");
const moment = require("moment-timezone");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
	config: {
		name: "up4",
		aliases: ["uptime4"],
		version: "11.0",
		author: "SIYAM-HASAN",
		countDown: 2,
		role: 0,
		description: {
			en: "Ultra HD Dynamic System Dashboard Card"
		},
		category: "system"
	},

	onStart: async function ({ api, message, event }) {
		const startTime = Date.now();

		const uptimeSeconds = process.uptime();
		const days = Math.floor(uptimeSeconds / (3600 * 24));
		const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
		const minutes = Math.floor((uptimeSeconds % 3600) / 60);
		const seconds = Math.floor(uptimeSeconds % 60);

		const dayProg = Math.min(1, days / 30);
		const hourProg = hours / 24;
		const minProg = minutes / 60;
		const secProg = seconds / 60;

		const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
		const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
		const usedMem = (totalMem - freeMem).toFixed(2);
		const ramPercent = Math.min(100, Math.round((usedMem / totalMem) * 100));

		const nodeVersion = process.version;
		const cpuLoad = (os.loadavg()[0] * 100 / os.cpus().length).toFixed(1);

		const currentTime = moment().tz("Asia/Dhaka").format("DD/MM/YYYY");
		const ping = Date.now() - startTime;
		const pingProg = Math.min(1, ping / 1000);

		const width = 1920;
		const height = 1080;
		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 1100);
		bgGrad.addColorStop(0, "#121722");
		bgGrad.addColorStop(0.6, "#080b11");
		bgGrad.addColorStop(1, "#020305");
		ctx.fillStyle = bgGrad;
		ctx.fillRect(0, 0, width, height);

		ctx.strokeStyle = "rgba(0, 240, 255, 0.04)";
		ctx.lineWidth = 2;
		for (let x = 0; x < width; x += 50) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);
			ctx.stroke();
		}
		for (let y = 0; y < height; y += 50) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(width, y);
			ctx.stroke();
		}

		const pad = 60;
		ctx.shadowColor = "#00f0ff";
		ctx.shadowBlur = 30;
		ctx.strokeStyle = "#00f0ff";
		ctx.lineWidth = 8;
		ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

		ctx.shadowColor = "#ff007f";
		ctx.shadowBlur = 20;
		ctx.strokeStyle = "#ff007f";
		ctx.lineWidth = 5;
		ctx.strokeRect(pad + 20, pad + 20, width - (pad + 20) * 2, height - (pad + 20) * 2);
		ctx.shadowBlur = 0;

		const headerX = 140;
		const headerY = 120;
		ctx.strokeStyle = "#00f0ff";
		ctx.shadowColor = "#00f0ff";
		ctx.shadowBlur = 15;
		ctx.lineWidth = 5;
		ctx.strokeRect(headerX, headerY, 450, 80);
		ctx.shadowBlur = 0;

		ctx.fillStyle = "#00f0ff";
		ctx.shadowColor = "#00f0ff";
		ctx.shadowBlur = 15;
		ctx.font = "bold 48px Arial, sans-serif";
		ctx.fillText("[SIYAM-BOT]", headerX + 25, headerY + 58);

		ctx.fillStyle = "#ff007f";
		ctx.shadowColor = "#ff007f";
		ctx.font = "bold 50px Arial, sans-serif";
		ctx.fillText("|", headerX + 500, headerY + 58);

		ctx.fillStyle = "#00ff66";
		ctx.shadowColor = "#00ff66";
		ctx.font = "bold 48px Arial, sans-serif";
		ctx.fillText(currentTime, headerX + 550, headerY + 58);
		ctx.shadowBlur = 0;

		const drawContrastFillBox = (x, y, w, h, progress, valText, labelText, color) => {
			ctx.strokeStyle = color;
			ctx.shadowColor = color;
			ctx.shadowBlur = 12;
			ctx.lineWidth = 4;
			ctx.strokeRect(x, y, w, h);

			const fillW = Math.max(10, (w - 10) * progress);
			ctx.fillStyle = color;
			ctx.globalAlpha = 0.35;
			ctx.fillRect(x + 5, y + 5, fillW, h - 10);
			ctx.globalAlpha = 1.0;

			ctx.font = "bold 46px Arial, sans-serif";
			ctx.strokeStyle = "#000000";
			ctx.lineWidth = 7;
			ctx.strokeText(valText, x + 30, y + 55);

			ctx.fillStyle = "#ffffff";
			ctx.shadowColor = "#000000";
			ctx.shadowBlur = 10;
			ctx.fillText(valText, x + 30, y + 55);

			ctx.font = "bold 22px Arial, sans-serif";
			ctx.strokeStyle = "#000000";
			ctx.lineWidth = 5;
			ctx.strokeText(labelText, x + 30, y + 90);

			ctx.fillStyle = color;
			ctx.shadowColor = color;
			ctx.shadowBlur = 8;
			ctx.fillText(labelText, x + 30, y + 90);
			ctx.shadowBlur = 0;
		};

		const boxX = 140;
		const boxW = 420;
		const boxH = 120;

		drawContrastFillBox(boxX, 260, boxW, boxH, dayProg, `${days}d`, "DAYS", "#00f0ff");
		drawContrastFillBox(boxX, 410, boxW, boxH, hourProg, `${hours}h`, "HOURS", "#ff007f");
		drawContrastFillBox(boxX, 560, boxW, boxH, minProg, `${minutes}m`, "MINUTES", "#ffd700");
		drawContrastFillBox(boxX, 710, boxW, boxH, secProg, `${seconds}s`, "SECONDS", "#00ff66");

		const drawRing = (cx, cy, radius, progress, valText, labelText, color) => {
			ctx.beginPath();
			ctx.arc(cx, cy, radius, 0, Math.PI * 2);
			ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
			ctx.lineWidth = 22;
			ctx.stroke();

			const startAngle = -Math.PI / 2;
			const endAngle = startAngle + (Math.PI * 2 * Math.max(0.02, progress));

			ctx.beginPath();
			ctx.arc(cx, cy, radius, startAngle, endAngle);
			ctx.strokeStyle = color;
			ctx.shadowColor = color;
			ctx.shadowBlur = 20;
			ctx.lineWidth = 24;
			ctx.lineCap = "round";
			ctx.stroke();
			ctx.shadowBlur = 0;

			ctx.fillStyle = "#ffffff";
			ctx.font = "bold 52px Arial, sans-serif";
			ctx.textAlign = "center";
			ctx.fillText(valText, cx, cy + 10);

			ctx.fillStyle = color;
			ctx.font = "bold 24px Arial, sans-serif";
			ctx.fillText(labelText, cx, cy + 50);
			ctx.textAlign = "left";
		};

		const ringCenterX = 1520;
		drawRing(ringCenterX, 360, 120, ramPercent / 100, `${ramPercent}%`, "RAM", "#ff007f");
		drawRing(ringCenterX, 670, 120, pingProg, `${ping}ms`, "PING", "#ffd700");

		const detailsY = 820;
		ctx.fillStyle = "rgba(0, 240, 255, 0.05)";
		ctx.strokeStyle = "#00f0ff";
		ctx.lineWidth = 2;
		ctx.fillRect(1350, detailsY, 340, 110);
		ctx.strokeRect(1350, detailsY, 340, 110);

		ctx.fillStyle = "#a8a8c8";
		ctx.font = "bold 20px Arial, sans-serif";
		ctx.fillText("CPU LOAD:", 1370, detailsY + 38);
		ctx.fillStyle = "#00ff66";
		ctx.fillText(`${cpuLoad}%`, 1550, detailsY + 38);

		ctx.fillStyle = "#a8a8c8";
		ctx.fillText("NODE VER:", 1370, detailsY + 82);
		ctx.fillStyle = "#00f0ff";
		ctx.fillText(nodeVersion, 1550, detailsY + 82);

		const avatarX = 680;
		const avatarY = 260;
		const avatarSize = 580;

		const avatarUrl = `https://graph.facebook.com/${event.senderID}/picture?height=1000&width=1000&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

		try {
			const imgRes = await axios.get(avatarUrl, { responseType: "arraybuffer", timeout: 6000 });
			const userImg = await loadImage(Buffer.from(imgRes.data));

			ctx.drawImage(userImg, avatarX, avatarY, avatarSize, avatarSize);

			ctx.strokeStyle = "#00f0ff";
			ctx.shadowColor = "#00f0ff";
			ctx.shadowBlur = 25;
			ctx.lineWidth = 10;
			ctx.strokeRect(avatarX, avatarY, avatarSize, avatarSize);

			ctx.strokeStyle = "#ff007f";
			ctx.shadowColor = "#ff007f";
			ctx.shadowBlur = 15;
			ctx.lineWidth = 5;
			ctx.strokeRect(avatarX - 10, avatarY - 10, avatarSize + 20, avatarSize + 20);
			ctx.shadowBlur = 0;
		} catch (e) {
			ctx.fillStyle = "#ff007f";
			ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
		}

		ctx.fillStyle = "#ffd700";
		ctx.shadowColor = "#ffd700";
		ctx.shadowBlur = 12;
		ctx.font = "bold 42px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.fillText("Developed by: Siyam Hasan", width / 2, 910);

		ctx.fillStyle = "#00ff66";
		ctx.shadowColor = "#00ff66";
		ctx.shadowBlur = 15;
		ctx.font = "bold 46px Arial, sans-serif";
		ctx.fillText("SYSTEM STATUS: ACTIVE", width / 2, 975);
		ctx.shadowBlur = 0;
		ctx.textAlign = "left";

		const cacheDir = path.join(__dirname, "cache");
		if (!fs.existsSync(cacheDir)) {
			fs.mkdirSync(cacheDir, { recursive: true });
		}

		const imagePath = path.join(cacheDir, `upt_hd_${Date.now()}.png`);
		const buffer = canvas.toBuffer("image/png");
		fs.writeFileSync(imagePath, buffer);

		return message.reply({
			attachment: fs.createReadStream(imagePath)
		}, () => {
			if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
		});
	}
};
