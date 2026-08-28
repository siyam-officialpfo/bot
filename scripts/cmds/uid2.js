const LOCKED_AUTHOR = "SIYAM-HASAN";
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "uid2",
		aliases: ["id2"],
		version: "5.0",
		author: LOCKED_AUTHOR,
		countDown: 5,
		role: 0,
		description: {
			en: "Get user UID with premium profile card"
		},
		category: "info",
		guide: {
			en: "{pn}\n{pn} @mention\n{pn} (reply)"
		}
	},

	onStart: async function ({ api, event }) {
		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
		}

		const { threadID, messageID, senderID, mentions, type, messageReply } = event;

		try {
			let targetID = senderID;

			if (Object.keys(mentions).length > 0) {
				targetID = Object.keys(mentions)[0];
			} else if (type === "message_reply" && messageReply?.senderID) {
				targetID = messageReply.senderID;
			}

			let userName = "Unknown User";

			try {
				const userInfo = await api.getUserInfo(targetID);
				if (userInfo && userInfo[targetID] && userInfo[targetID].name) {
					userName = userInfo[targetID].name;
				}
			} catch (e) {
				try {
					const info = await api.getUserInfo([targetID]);
					if (info && info[targetID] && info[targetID].name) {
						userName = info[targetID].name;
					}
				} catch (err) {}
			}

			const width = 820;
			const height = 480;
			const canvas = createCanvas(width, height);
			const ctx = canvas.getContext("2d");

			const bg = ctx.createLinearGradient(0, 0, width, height);
			bg.addColorStop(0, "#1c0a16");
			bg.addColorStop(0.3, "#2d1230");
			bg.addColorStop(0.6, "#3b1540");
			bg.addColorStop(1, "#1a0b1c");
			ctx.fillStyle = bg;
			ctx.fillRect(0, 0, width, height);

			const light1 = ctx.createRadialGradient(100, 60, 10, 120, 120, 300);
			light1.addColorStop(0, "rgba(251, 113, 133, 0.35)");
			light1.addColorStop(1, "rgba(251, 113, 133, 0)");
			ctx.fillStyle = light1;
			ctx.fillRect(0, 0, width, height);

			const light2 = ctx.createRadialGradient(720, 80, 20, 680, 160, 340);
			light2.addColorStop(0, "rgba(192, 132, 252, 0.3)");
			light2.addColorStop(1, "rgba(192, 132, 252, 0)");
			ctx.fillStyle = light2;
			ctx.fillRect(0, 0, width, height);

			const light3 = ctx.createRadialGradient(400, 450, 30, 400, 380, 280);
			light3.addColorStop(0, "rgba(244, 114, 182, 0.25)");
			light3.addColorStop(1, "rgba(244, 114, 182, 0)");
			ctx.fillStyle = light3;
			ctx.fillRect(0, 0, width, height);

			const light4 = ctx.createRadialGradient(200, 400, 20, 180, 350, 200);
			light4.addColorStop(0, "rgba(253, 164, 175, 0.2)");
			light4.addColorStop(1, "rgba(253, 164, 175, 0)");
			ctx.fillStyle = light4;
			ctx.fillRect(0, 0, width, height);

			ctx.save();
			ctx.shadowColor = "rgba(244, 114, 182, 0.4)";
			ctx.shadowBlur = 32;
			roundRect(ctx, 20, 20, 780, 440, 26);
			ctx.fillStyle = "rgba(25, 12, 32, 0.9)";
			ctx.fill();
			ctx.restore();

			ctx.strokeStyle = "rgba(251, 113, 133, 0.6)";
			ctx.lineWidth = 3;
			roundRect(ctx, 20, 20, 780, 440, 26);
			ctx.stroke();

			ctx.strokeStyle = "rgba(192, 132, 252, 0.3)";
			ctx.lineWidth = 1.5;
			roundRect(ctx, 32, 32, 756, 416, 20);
			ctx.stroke();

			const headerGrad = ctx.createLinearGradient(45, 40, 775, 40);
			headerGrad.addColorStop(0, "#fb7185");
			headerGrad.addColorStop(0.5, "#e879f9");
			headerGrad.addColorStop(1, "#c084fc");
			ctx.fillStyle = headerGrad;
			roundRect(ctx, 45, 40, 730, 52, 14);
			ctx.fill();

			ctx.font = "bold 28px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.textAlign = "center";
			ctx.shadowColor = "rgba(0,0,0,0.3)";
			ctx.shadowBlur = 6;
			ctx.fillText("UID", 410, 76);
			ctx.shadowBlur = 0;

			const avatarSize = 175;
			const avatarX = 70;
			const avatarY = 120;

			ctx.save();
			ctx.beginPath();
			ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 7, 0, Math.PI * 2);
			const ringGrad = ctx.createLinearGradient(avatarX, avatarY, avatarX + avatarSize, avatarY + avatarSize);
			ringGrad.addColorStop(0, "#fb7185");
			ringGrad.addColorStop(0.5, "#e879f9");
			ringGrad.addColorStop(1, "#c084fc");
			ctx.strokeStyle = ringGrad;
			ctx.lineWidth = 6;
			ctx.stroke();
			ctx.restore();

			ctx.save();
			ctx.beginPath();
			ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
			ctx.closePath();
			ctx.clip();

			try {
				const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
				const avatar = await loadImage(avatarUrl);
				ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
			} catch (e) {
				ctx.fillStyle = "#4a1d3a";
				ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
				ctx.font = "bold 42px Arial";
				ctx.fillStyle = "#f9a8d4";
				ctx.textAlign = "center";
				ctx.fillText("?", avatarX + avatarSize / 2, avatarY + avatarSize / 2 + 16);
			}
			ctx.restore();

			ctx.fillStyle = "rgba(45, 20, 50, 0.85)";
			roundRect(ctx, 290, 115, 480, 100, 16);
			ctx.fill();

			ctx.fillStyle = "#fb7185";
			ctx.shadowColor = "#fb7185";
			ctx.shadowBlur = 10;
			roundRect(ctx, 290, 115, 8, 100, 6);
			ctx.fill();
			ctx.shadowBlur = 0;

			ctx.font = "bold 15px Arial";
			ctx.fillStyle = "#f9a8d4";
			ctx.textAlign = "left";
			ctx.fillText("USER NAME", 320, 150);

			ctx.font = "bold 27px Arial";
			ctx.fillStyle = "#ffffff";
			const displayName = userName.length > 22 ? userName.slice(0, 22) + "..." : userName;
			ctx.fillText(displayName, 320, 190);

			ctx.fillStyle = "rgba(45, 20, 50, 0.85)";
			roundRect(ctx, 290, 235, 480, 100, 16);
			ctx.fill();

			ctx.fillStyle = "#c084fc";
			ctx.shadowColor = "#c084fc";
			ctx.shadowBlur = 10;
			roundRect(ctx, 290, 235, 8, 100, 6);
			ctx.fill();
			ctx.shadowBlur = 0;

			ctx.font = "bold 15px Arial";
			ctx.fillStyle = "#e9d5ff";
			ctx.fillText("USER ID", 320, 270);

			ctx.font = "bold 26px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText(String(targetID), 320, 310);

			ctx.fillStyle = "rgba(50, 20, 55, 0.9)";
			roundRect(ctx, 50, 360, 720, 70, 16);
			ctx.fill();

			const bottomGrad = ctx.createLinearGradient(50, 360, 770, 360);
			bottomGrad.addColorStop(0, "#fb7185");
			bottomGrad.addColorStop(0.5, "#e879f9");
			bottomGrad.addColorStop(1, "#c084fc");
			ctx.fillStyle = bottomGrad;
			ctx.fillRect(50, 360, 720, 5);

			ctx.font = "bold 26px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.textAlign = "center";
			ctx.shadowColor = "rgba(0,0,0,0.3)";
			ctx.shadowBlur = 5;
			ctx.fillText("Owner : Siyam Hasan", 410, 410);
			ctx.shadowBlur = 0;

			const cachePath = path.join(__dirname, "cache");
			await fs.ensureDir(cachePath);
			const filePath = path.join(cachePath, `uid_${Date.now()}.png`);
			await fs.writeFile(filePath, canvas.toBuffer("image/png"));

			await api.sendMessage({
				body: String(targetID),
				attachment: fs.createReadStream(filePath)
			}, threadID, messageID);

			setTimeout(() => {
				fs.unlink(filePath).catch(() => {});
			}, 30000);

		} catch (err) {
			console.log(err);
			return api.sendMessage("UID card generate korte problem hoise.", threadID, messageID);
		}
	}
};

function roundRect(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
    }
