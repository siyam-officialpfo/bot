const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const GIFEncoder = require("gifencoder");

module.exports = {
	config: {
		name: "uid3",
		aliases: ["ইউ"],
		version: "2.0",
		author: "SIYAM-HASAN",
		countDown: 5,
		role: 0,
		description: {
			en: "Generates animated floral heart themed user profile card"
		},
		category: "user"
	},

	onStart: async function ({ api, message, event }) {
		let targetID = event.senderID;
		if (Object.keys(event.mentions).length > 0) {
			targetID = Object.keys(event.mentions)[0];
		}

		const loadingMsg = await message.reply("⏳ 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗻𝗴 𝗨𝗜 𝗖𝗮𝗿𝗱...");

		let userName = "Facebook User";
		try {
			const userInfo = await api.getUserInfo(targetID);
			if (userInfo[targetID] && userInfo[targetID].name) {
				userName = userInfo[targetID].name;
			}
		} catch (e) {
			userName = "Facebook User";
		}

		const botName = "SIYAM-BOT";
		const ownerName = "SIYAM HASAN";

		const width = 900;
		const height = 550;

		const cacheDir = path.join(__dirname, "cache");
		if (!fs.existsSync(cacheDir)) {
			fs.mkdirSync(cacheDir, { recursive: true });
		}
		const gifPath = path.join(cacheDir, `user_card_${Date.now()}.gif`);

		const encoder = new GIFEncoder(width, height);
		const writeStream = fs.createWriteStream(gifPath);

		encoder.createReadStream().pipe(writeStream);
		encoder.start();
		encoder.setRepeat(0);
		encoder.setDelay(110);
		encoder.setQuality(10);

		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		const avatarUrl = `https://graph.facebook.com/${targetID}/picture?height=600&width=600&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
		let userImg = null;

		try {
			const imgRes = await axios.get(avatarUrl, { responseType: "arraybuffer", timeout: 6000 });
			userImg = await loadImage(Buffer.from(imgRes.data));
		} catch (e) {
			userImg = null;
		}

		const drawHeart = (x, y, size, color) => {
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.shadowColor = color;
			ctx.shadowBlur = 10;
			const topCurveHeight = size * 0.3;
			ctx.moveTo(x, y + topCurveHeight);
			ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
			ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + size, x, y + size);
			ctx.bezierCurveTo(x, y + size, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
			ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
		};

		const totalFrames = 12;

		for (let frame = 0; frame < totalFrames; frame++) {
			const bgGrad = ctx.createLinearGradient(0, 0, width, height);
			bgGrad.addColorStop(0, "#2a0845");
			bgGrad.addColorStop(0.5, "#6441a5");
			bgGrad.addColorStop(1, "#200122");
			ctx.fillStyle = bgGrad;
			ctx.fillRect(0, 0, width, height);

			const heartColors = ["#ff007f", "#00f0ff", "#ff0055", "#ffd700", "#00ff66"];
			for (let i = 0; i < 25; i++) {
				const hX = (i * 37 + frame * 10) % width;
				const hY = (i * 53 + frame * 5) % height;
				const hSize = 12 + (i % 3) * 6;
				const color = heartColors[(i + frame) % heartColors.length];
				ctx.globalAlpha = 0.35;
				drawHeart(hX, hY, hSize, color);
			}
			ctx.globalAlpha = 1.0;

			const pad = 20;
			const isRed = frame % 2 === 0;
			const borderPrimary = isRed ? "#ff007f" : "#00f0ff";
			const borderSecondary = isRed ? "#00f0ff" : "#ff007f";

			ctx.strokeStyle = borderPrimary;
			ctx.shadowColor = borderPrimary;
			ctx.shadowBlur = 18;
			ctx.lineWidth = 4;
			ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

			ctx.strokeStyle = borderSecondary;
			ctx.shadowColor = borderSecondary;
			ctx.shadowBlur = 12;
			ctx.lineWidth = 2;
			ctx.strokeRect(pad + 8, pad + 8, width - (pad + 8) * 2, height - (pad + 8) * 2);
			ctx.shadowBlur = 0;

			const lightColors = ["#ff0000", "#00f0ff", "#00ff66", "#ffd700"];
			const l1 = lightColors[frame % lightColors.length];
			const l2 = lightColors[(frame + 2) % lightColors.length];

			ctx.fillStyle = l1;
			ctx.shadowColor = l1;
			ctx.shadowBlur = 15;
			ctx.beginPath(); ctx.arc(pad + 15, pad + 15, 8, 0, Math.PI * 2); ctx.fill();
			ctx.beginPath(); ctx.arc(width - pad - 15, height - pad - 15, 8, 0, Math.PI * 2); ctx.fill();

			ctx.fillStyle = l2;
			ctx.shadowColor = l2;
			ctx.shadowBlur = 15;
			ctx.beginPath(); ctx.arc(width - pad - 15, pad + 15, 8, 0, Math.PI * 2); ctx.fill();
			ctx.beginPath(); ctx.arc(pad + 15, height - pad - 15, 8, 0, Math.PI * 2); ctx.fill();
			ctx.shadowBlur = 0;

			const cx = 170;
			const cy = 230;
			const radius = 100;

			if (userImg) {
				ctx.save();
				ctx.beginPath();
				ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.clip();
				ctx.drawImage(userImg, cx - radius, cy - radius, radius * 2, radius * 2);
				ctx.restore();
			} else {
				ctx.beginPath();
				ctx.arc(cx, cy, radius, 0, Math.PI * 2);
				ctx.fillStyle = "#ff007f";
				ctx.fill();
			}

			const ringGlow = lightColors[frame % lightColors.length];
			ctx.beginPath();
			ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
			ctx.strokeStyle = ringGlow;
			ctx.shadowColor = ringGlow;
			ctx.shadowBlur = 25;
			ctx.lineWidth = 6;
			ctx.stroke();
			ctx.shadowBlur = 0;

			const textX = 310;

			ctx.fillStyle = "#ffffff";
			ctx.shadowColor = "#ffffff";
			ctx.shadowBlur = 8;
			ctx.font = "bold 38px Arial, sans-serif";
			ctx.fillText(userName, textX, 170);

			ctx.fillStyle = "#e0e0ff";
			ctx.shadowBlur = 0;
			ctx.font = "bold 20px Arial, sans-serif";
			ctx.fillText("USER ID:", textX, 225);

			const uidGlow = lightColors[(frame + 1) % lightColors.length];
			ctx.fillStyle = uidGlow;
			ctx.shadowColor = uidGlow;
			ctx.shadowBlur = 12;
			ctx.font = "bold 28px Arial, sans-serif";
			ctx.fillText(targetID, textX + 110, 227);
			ctx.shadowBlur = 0;

			ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(textX, 260);
			ctx.lineTo(width - 80, 260);
			ctx.stroke();

			ctx.fillStyle = "#e0e0ff";
			ctx.font = "bold 20px Arial, sans-serif";
			ctx.fillText("BOT NAME:", textX, 310);

			ctx.fillStyle = "#00ff66";
			ctx.shadowColor = "#00ff66";
			ctx.shadowBlur = 8;
			ctx.font = "bold 22px Arial, sans-serif";
			ctx.fillText(botName, textX + 130, 310);

			ctx.fillStyle = "#e0e0ff";
			ctx.shadowBlur = 0;
			ctx.font = "bold 20px Arial, sans-serif";
			ctx.fillText("OWNER:", textX, 355);

			ctx.fillStyle = "#ffd700";
			ctx.shadowColor = "#ffd700";
			ctx.shadowBlur = 8;
			ctx.font = "bold 22px Arial, sans-serif";
			ctx.fillText(ownerName, textX + 100, 355);
			ctx.shadowBlur = 0;

			ctx.fillStyle = "#00f0ff";
			ctx.shadowColor = "#00f0ff";
			ctx.shadowBlur = 12;
			ctx.font = "bold 22px Arial, sans-serif";
			ctx.textAlign = "center";
			ctx.fillText("SYSTEM STATUS: ACTIVE", width / 2, 480);
			ctx.shadowBlur = 0;
			ctx.textAlign = "left";

			encoder.addFrame(ctx);
		}

		encoder.finish();

		writeStream.on("finish", async () => {
			if (loadingMsg && loadingMsg.messageID) {
				try {
					await api.unsendMessage(loadingMsg.messageID);
				} catch (err) {}
			}

			return message.reply({
				body: targetID,
				attachment: fs.createReadStream(gifPath)
			}, () => {
				if (fs.existsSync(gifPath)) fs.unlinkSync(gifPath);
			});
		});
	}
};
