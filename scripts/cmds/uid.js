const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

function cleanText(text) {
	if (!text) return "";
	return text
		.normalize("NFKC")
		.replace(/[^\x20-\x7E\u0980-\u09FF]/g, "")
		.trim();
}

function drawRoundRect(ctx, x, y, width, height, radius) {
	if (typeof radius === 'number') {
		radius = { tl: radius, tr: radius, br: radius, bl: radius };
	} else {
		radius = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0 }, radius);
	}
	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + width - radius.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	ctx.lineTo(x + width, y + height - radius.br);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	ctx.lineTo(x + radius.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();
}

function drawPolygon(ctx, x, y, radius, sides) {
	ctx.beginPath();
	for (let i = 0; i < sides; i++) {
		const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
		const px = x + radius * Math.cos(angle);
		const py = y + radius * Math.sin(angle);
		if (i === 0) ctx.moveTo(px, py);
		else ctx.lineTo(px, py);
	}
	ctx.closePath();
}

module.exports = {
	config: {
		name: "uid",
		aliases: ["id", "userid"],
		version: "3.2",
		author: LOCKED_AUTHOR,
		countDown: 3,
		role: 0,
		description: {
			en: "Get real FB user name & UID card"
		},
		category: "user"
	},

	onStart: async function ({ api, event, message, usersData }) {
		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
		}

		const waitMsg = await message.reply("✄------------");

		const cacheDir = path.join(__dirname, "cache");
		if (!fs.existsSync(cacheDir)) {
			fs.mkdirSync(cacheDir, { recursive: true });
		}

		let targetID = event.senderID;
		if (event.type === "message_reply" && event.messageReply) {
			targetID = event.messageReply.senderID;
		} else if (event.mentions && Object.keys(event.mentions).length > 0) {
			targetID = Object.keys(event.mentions)[0];
		}

		const imgPath = path.join(cacheDir, `uid_${targetID}_${Date.now()}.png`);

		try {
			let rawUserName = "";
			try {
				if (usersData && typeof usersData.get === "function") {
					const uData = await usersData.get(targetID);
					if (uData && uData.name) rawUserName = uData.name;
				}
				if (!rawUserName && api && typeof api.getUserInfo === "function") {
					const info = await api.getUserInfo(targetID);
					if (info && info[targetID]) rawUserName = info[targetID].name;
				}
			} catch (e) {
				rawUserName = "FACEBOOK USER";
			}

			const displayUserName = rawUserName || "FACEBOOK USER";
			const cleanUserName = cleanText(displayUserName).toUpperCase() || "FACEBOOK USER";
			const ownerName = cleanText(LOCKED_AUTHOR) || "SIYAM HASAN";
			const avatarLink = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

			const width = 850;
			const height = 420;
			const canvas = createCanvas(width, height);
			const ctx = canvas.getContext("2d");

			// Base Deep Black Background
			ctx.fillStyle = "#020204";
			ctx.fillRect(0, 0, width, height);

			// Multi-color Cyber Neon Light Glow Layer
			ctx.save();
			const orbCyan = ctx.createRadialGradient(180, 100, 10, 180, 100, 320);
			orbCyan.addColorStop(0, "rgba(0, 245, 212, 0.25)");
			orbCyan.addColorStop(0.5, "rgba(0, 245, 212, 0.08)");
			orbCyan.addColorStop(1, "transparent");
			ctx.fillStyle = orbCyan;
			ctx.fillRect(0, 0, width, height);

			const orbMagenta = ctx.createRadialGradient(720, 320, 10, 720, 320, 350);
			orbMagenta.addColorStop(0, "rgba(255, 0, 127, 0.22)");
			orbMagenta.addColorStop(0.5, "rgba(255, 0, 127, 0.07)");
			orbMagenta.addColorStop(1, "transparent");
			ctx.fillStyle = orbMagenta;
			ctx.fillRect(0, 0, width, height);

			const orbPurple = ctx.createRadialGradient(425, 380, 10, 425, 380, 280);
			orbPurple.addColorStop(0, "rgba(112, 0, 255, 0.20)");
			orbPurple.addColorStop(1, "transparent");
			ctx.fillStyle = orbPurple;
			ctx.fillRect(0, 0, width, height);
			ctx.restore();

			// Grid Overlay
			ctx.save();
			ctx.strokeStyle = "rgba(0, 245, 212, 0.04)";
			ctx.lineWidth = 1;
			for (let x = 0; x < width; x += 30) {
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, height);
				ctx.stroke();
			}
			for (let y = 0; y < height; y += 30) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(width, y);
				ctx.stroke();
			}
			ctx.restore();

			// Main Card
			ctx.save();
			drawRoundRect(ctx, 25, 25, width - 50, height - 50, 22);
			ctx.fillStyle = "rgba(8, 10, 18, 0.92)";
			ctx.fill();

			ctx.shadowColor = "#00f5d4";
			ctx.shadowBlur = 18;
			ctx.strokeStyle = "#00f5d4";
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.shadowColor = "#ff007f";
			ctx.shadowBlur = 12;
			ctx.strokeStyle = "rgba(255, 0, 127, 0.6)";
			ctx.lineWidth = 1.5;
			drawRoundRect(ctx, 21, 21, width - 42, height - 42, 24);
			ctx.stroke();
			ctx.restore();

			// Hexagon Profile Frame
			const hexX = 160;
			const hexY = 210;
			const hexRadius = 110;

			ctx.save();
			drawPolygon(ctx, hexX, hexY, hexRadius + 8, 6);
			const hexGrad = ctx.createLinearGradient(hexX - hexRadius, hexY - hexRadius, hexX + hexRadius, hexY + hexRadius);
			hexGrad.addColorStop(0, "#00f5d4");
			hexGrad.addColorStop(0.5, "#7000ff");
			hexGrad.addColorStop(1, "#ff007f");
			ctx.strokeStyle = hexGrad;
			ctx.lineWidth = 6;
			ctx.shadowColor = "#00f5d4";
			ctx.shadowBlur = 22;
			ctx.stroke();
			ctx.restore();

			try {
				const avatarImg = await loadImage(avatarLink);
				ctx.save();
				drawPolygon(ctx, hexX, hexY, hexRadius, 6);
				ctx.clip();
				ctx.drawImage(avatarImg, hexX - hexRadius, hexY - hexRadius, hexRadius * 2, hexRadius * 2);
				ctx.restore();
			} catch (e) {
				ctx.save();
				drawPolygon(ctx, hexX, hexY, hexRadius, 6);
				ctx.fillStyle = "#12182e";
				ctx.fill();
				ctx.fillStyle = "#00f5d4";
				ctx.font = "bold 70px sans-serif";
				ctx.textAlign = "center";
				ctx.fillText(cleanUserName.charAt(0) || "U", hexX, hexY + 24);
				ctx.restore();
			}

			const contentX = 330;

			ctx.save();
			ctx.font = "bold 15px sans-serif";
			ctx.fillStyle = "#8e9bbd";
			ctx.fillText("USER NAME", contentX, 85);

			ctx.font = "bold 28px sans-serif";
			ctx.fillStyle = "#ffffff";
			ctx.shadowColor = "#ffffff";
			ctx.shadowBlur = 8;
			ctx.fillText(cleanUserName, contentX, 122);
			ctx.shadowBlur = 0;

			ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
			ctx.beginPath();
			ctx.moveTo(contentX, 145);
			ctx.lineTo(width - 60, 145);
			ctx.stroke();

			ctx.font = "bold 15px sans-serif";
			ctx.fillStyle = "#8e9bbd";
			ctx.fillText("USER ID", contentX, 185);

			ctx.font = "bold 32px sans-serif";
			ctx.fillStyle = "#00f5d4";
			ctx.shadowColor = "#00f5d4";
			ctx.shadowBlur = 14;
			ctx.fillText(targetID, contentX, 225);
			ctx.shadowBlur = 0;

			ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
			ctx.beginPath();
			ctx.moveTo(contentX, 250);
			ctx.lineTo(width - 60, 250);
			ctx.stroke();

			ctx.font = "bold 15px sans-serif";
			ctx.fillStyle = "#8e9bbd";
			ctx.fillText("SYSTEM OWNER", contentX, 290);

			ctx.font = "bold 24px sans-serif";
			ctx.fillStyle = "#ffee32";
			ctx.shadowColor = "#ffee32";
			ctx.shadowBlur = 10;
			ctx.fillText(ownerName, contentX, 328);
			ctx.restore();

			const buffer = canvas.toBuffer("image/png");
			await fs.writeFile(imgPath, buffer);

			if (waitMsg && waitMsg.messageID) {
				if (typeof message.unsend === "function") {
					await message.unsend(waitMsg.messageID);
				} else if (api && typeof api.unsendMessage === "function") {
					api.unsendMessage(waitMsg.messageID);
				}
			}

			const msgStream = fs.createReadStream(imgPath);

			return await message.reply({
				body: `${targetID}`,
				attachment: msgStream
			});

		} catch (err) {
			console.error("UID Command Error:", err);
			if (waitMsg && waitMsg.messageID) {
				if (typeof message.unsend === "function") {
					await message.unsend(waitMsg.messageID);
				} else if (api && typeof api.unsendMessage === "function") {
					api.unsendMessage(waitMsg.messageID);
				}
			}
		} finally {
			setTimeout(() => {
				if (fs.existsSync(imgPath)) {
					fs.unlinkSync(imgPath);
				}
			}, 5000);
		}
	}
};
