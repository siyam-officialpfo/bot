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

module.exports = {
	config: {
		name: "rank",
		aliases: ["রেংক", "লেবেল"],
		version: "3.5",
		author: LOCKED_AUTHOR,
		countDown: 5,
		role: 0,
		description: {
			en: "Generate Ultra HD Cyberpunk VIP Profile Dashboard Card"
		},
		category: "user"
	},

	onStart: async function ({ api, event, message, usersData }) {
		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
		}

		const cacheDir = path.join(__dirname, "cache");
		if (!fs.existsSync(cacheDir)) {
			fs.mkdirSync(cacheDir, { recursive: true });
		}

		const targetID = (event.mentions && Object.keys(event.mentions)[0]) || event.senderID;
		const imgPath = path.join(cacheDir, `profile_${targetID}_${Date.now()}.png`);

		try {
			const userData = (await usersData.get(targetID)) || {};
			const rawName = userData.name || "Nijhum User";
			let userName = cleanText(rawName).toUpperCase();
			if (!userName) userName = "VIP USER";

			const authorClean = cleanText(LOCKED_AUTHOR) || "SIYAM HASAN";

			const xp = userData.exp || 3450;
			const level = Math.floor(Math.sqrt(xp) * 0.1) || 12;
			const money = (userData.money || 75800).toLocaleString("en-US");
			const role = targetID === "100000000000000" ? "FOUNDER & OWNER" : (userData.role === 2 ? "ADMINISTRATOR" : "VIP PREMIUM MEMBER");
			const totalMsg = (userData.msgCount || 1420).toLocaleString("en-US");

			let userRank = "#1";
			try {
				if (typeof usersData.getAll === "function") {
					const allUsers = await usersData.getAll();
					allUsers.sort((a, b) => (b.exp || 0) - (a.exp || 0));
					const index = allUsers.findIndex(u => (u.userID || u.id || u.senderID) === targetID);
					if (index !== -1) userRank = `#${index + 1}`;
				} else {
					userRank = `#${Math.max(1, 100 - level)}`;
				}
			} catch (e) {
				userRank = `#${Math.max(1, 100 - level)}`;
			}

			const avatarLink = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

			const width = 1920;
			const height = 1080;
			const canvas = createCanvas(width, height);
			const ctx = canvas.getContext("2d");

			const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, 1200);
			bgGrad.addColorStop(0, "#0d0a21");
			bgGrad.addColorStop(0.4, "#060414");
			bgGrad.addColorStop(1, "#020108");
			ctx.fillStyle = bgGrad;
			ctx.fillRect(0, 0, width, height);

			ctx.save();
			ctx.strokeStyle = "rgba(0, 245, 212, 0.04)";
			ctx.lineWidth = 1;
			for (let x = 0; x < width; x += 60) {
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, height);
				ctx.stroke();
			}
			for (let y = 0; y < height; y += 60) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(width, y);
				ctx.stroke();
			}
			ctx.restore();

			ctx.save();
			const orb1 = ctx.createRadialGradient(300, 300, 10, 300, 300, 400);
			orb1.addColorStop(0, "rgba(255, 0, 127, 0.25)");
			orb1.addColorStop(1, "transparent");
			ctx.fillStyle = orb1;
			ctx.fillRect(0, 0, 800, 800);

			const orb2 = ctx.createRadialGradient(1600, 800, 10, 1600, 800, 500);
			orb2.addColorStop(0, "rgba(0, 245, 212, 0.25)");
			orb2.addColorStop(1, "transparent");
			ctx.fillStyle = orb2;
			ctx.fillRect(1000, 400, 920, 680);
			ctx.restore();

			ctx.save();
			drawRoundRect(ctx, 60, 60, width - 120, height - 120, 32);
			ctx.fillStyle = "rgba(12, 14, 33, 0.75)";
			ctx.fill();
			ctx.strokeStyle = "rgba(0, 245, 212, 0.35)";
			ctx.lineWidth = 3;
			ctx.stroke();
			ctx.restore();

			ctx.save();
			drawRoundRect(ctx, 90, 90, width - 180, 120, 22);
			ctx.fillStyle = "rgba(20, 24, 56, 0.85)";
			ctx.fill();
			ctx.strokeStyle = "rgba(255, 0, 127, 0.4)";
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.font = "bold 44px sans-serif";
			ctx.fillStyle = "#ffffff";
			ctx.shadowColor = "#ff007f";
			ctx.shadowBlur = 16;
			ctx.fillText("CYBER VIP PROFILE DASHBOARD", 130, 160);

			ctx.shadowBlur = 0;
			ctx.font = "bold 20px sans-serif";
			ctx.fillStyle = "#00f5d4";
			ctx.fillText("SYSTEM USER IDENTITY * AUTHENTICATED ACCESS", 130, 192);

			ctx.fillStyle = "rgba(0, 255, 136, 0.15)";
			drawRoundRect(ctx, width - 420, 125, 290, 50, 25);
			ctx.fill();
			ctx.strokeStyle = "#00ff88";
			ctx.lineWidth = 1.5;
			ctx.stroke();

			ctx.font = "bold 20px sans-serif";
			ctx.fillStyle = "#00ff88";
			ctx.textAlign = "center";
			ctx.shadowColor = "#00ff88";
			ctx.shadowBlur = 10;
			ctx.fillText("SYSTEM ONLINE", width - 275, 157);
			ctx.restore();

			const avatarSize = 280;
			const avatarX = 140;
			const avatarY = 260;

			ctx.save();
			const ringGrad = ctx.createLinearGradient(avatarX, avatarY, avatarX + avatarSize, avatarY + avatarSize);
			ringGrad.addColorStop(0, "#ff007f");
			ringGrad.addColorStop(0.5, "#ffee32");
			ringGrad.addColorStop(1, "#00f5d4");

			ctx.shadowColor = "#00f5d4";
			ctx.shadowBlur = 25;
			ctx.strokeStyle = ringGrad;
			ctx.lineWidth = 8;
			ctx.beginPath();
			ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 10, 0, Math.PI * 2);
			ctx.stroke();
			ctx.restore();

			try {
				const avatarImg = await loadImage(avatarLink);
				ctx.save();
				ctx.beginPath();
				ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
				ctx.closePath();
				ctx.clip();
				ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
				ctx.restore();
			} catch (e) {
				ctx.save();
				ctx.fillStyle = "#1b1e42";
				ctx.beginPath();
				ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
				ctx.fill();
				ctx.fillStyle = "#00f5d4";
				ctx.font = "bold 80px sans-serif";
				ctx.textAlign = "center";
				ctx.fillText(userName.charAt(0) || "U", avatarX + avatarSize / 2, avatarY + avatarSize / 2 + 28);
				ctx.restore();
			}

			ctx.save();
			drawRoundRect(ctx, 100, 580, 520, 390, 24);
			ctx.fillStyle = "rgba(16, 20, 48, 0.85)";
			ctx.fill();
			ctx.strokeStyle = "rgba(255, 0, 127, 0.4)";
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.font = "bold 26px sans-serif";
			ctx.fillStyle = "#ff007f";
			ctx.shadowColor = "#ff007f";
			ctx.shadowBlur = 12;
			ctx.textAlign = "left";
			ctx.fillText("USER BIOMETRICS", 130, 630);
			ctx.shadowBlur = 0;

			ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
			ctx.beginPath();
			ctx.moveTo(130, 650);
			ctx.lineTo(590, 650);
			ctx.stroke();

			const userBio = [
				{ label: "Account ID", val: targetID.substring(0, 12) + "..." },
				{ label: "Global Role", val: role, color: "#ffee32" },
				{ label: "Level Rank", val: `LEVEL ${level}`, color: "#00f5d4" },
				{ label: "Server Rank", val: `RANK ${userRank}`, color: "#ff007f" },
				{ label: "Security Status", val: "VERIFIED", color: "#00ff88" }
			];

			let bioY = 690;
			userBio.forEach((b) => {
				ctx.font = "bold 18px sans-serif";
				ctx.fillStyle = "#a5b0e8";
				ctx.fillText(b.label, 130, bioY);

				ctx.font = "bold 19px sans-serif";
				ctx.fillStyle = b.color || "#ffffff";
				ctx.textAlign = "right";
				ctx.fillText(b.val, 590, bioY);
				ctx.textAlign = "left";

				bioY += 46;
			});
			ctx.restore();

			ctx.save();
			drawRoundRect(ctx, 660, 260, 1170, 120, 24);
			ctx.fillStyle = "rgba(16, 20, 48, 0.85)";
			ctx.fill();
			ctx.strokeStyle = "rgba(0, 245, 212, 0.4)";
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.font = "bold 38px sans-serif";
			ctx.fillStyle = "#ffffff";
			ctx.shadowColor = "#00f5d4";
			ctx.shadowBlur = 14;
			ctx.fillText(userName, 700, 325);

			ctx.shadowBlur = 0;
			ctx.font = "bold 20px sans-serif";
			ctx.fillStyle = "#ffee32";
			ctx.fillText(`${role} * NIJHUM BOT NETWORK`, 700, 360);
			ctx.restore();

			const metrics = [
				{ label: "TOTAL EXPERIENCE (XP)", val: `${xp.toLocaleString()} XP`, color: "#00f5d4" },
				{ label: "TOTAL WALLET BALANCE", val: `$${money}`, color: "#ffee32" },
				{ label: "TOTAL MESSAGES SENT", val: `${totalMsg} MSG`, color: "#ff007f" },
				{ label: "GLOBAL RANK POSITION", val: `RANK ${userRank}`, color: "#00ff88" }
			];

			metrics.forEach((m, idx) => {
				const col = idx % 2;
				const row = Math.floor(idx / 2);
				const mx = 660 + col * 595;
				const my = 405 + row * 165;

				ctx.save();
				drawRoundRect(ctx, mx, my, 575, 145, 20);
				ctx.fillStyle = "rgba(18, 24, 54, 0.85)";
				ctx.fill();
				ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
				ctx.lineWidth = 1.5;
				ctx.stroke();

				ctx.font = "bold 20px sans-serif";
				ctx.fillStyle = "#a5b0e8";
				ctx.fillText(m.label, mx + 25, my + 45);

				ctx.font = "bold 34px sans-serif";
				ctx.fillStyle = m.color;
				ctx.shadowColor = m.color;
				ctx.shadowBlur = 12;
				ctx.fillText(m.val, mx + 25, my + 105);
				ctx.restore();
			});

			ctx.save();
			drawRoundRect(ctx, 660, 755, 1170, 215, 24);
			ctx.fillStyle = "rgba(16, 20, 48, 0.85)";
			ctx.fill();
			ctx.strokeStyle = "rgba(255, 238, 50, 0.4)";
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.font = "bold 24px sans-serif";
			ctx.fillStyle = "#ffee32";
			ctx.shadowColor = "#ffee32";
			ctx.shadowBlur = 10;
			ctx.fillText("LEVEL PROGRESSION", 690, 800);
			ctx.shadowBlur = 0;

			const currentLevelXp = Math.pow(level / 0.1, 2);
			const nextLevelXp = Math.pow((level + 1) / 0.1, 2);
			const pct = Math.min(100, Math.max(8, Math.floor(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100)));

			ctx.font = "bold 20px sans-serif";
			ctx.fillStyle = "#00f5d4";
			ctx.textAlign = "right";
			ctx.fillText(`${pct}% TO LEVEL ${level + 1}`, 1800, 800);
			ctx.textAlign = "left";

			const pBarX = 690;
			const pBarY = 825;
			const pBarW = 1110;
			const pBarH = 32;

			ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
			drawRoundRect(ctx, pBarX, pBarY, pBarW, pBarH, 16);
			ctx.fill();

			const fillW = Math.max(30, (pBarW * pct) / 100);
			const barGrad = ctx.createLinearGradient(pBarX, 0, pBarX + fillW, 0);
			barGrad.addColorStop(0, "#ff007f");
			barGrad.addColorStop(0.5, "#ffee32");
			barGrad.addColorStop(1, "#00f5d4");

			ctx.fillStyle = barGrad;
			ctx.shadowColor = "#00f5d4";
			ctx.shadowBlur = 14;
			drawRoundRect(ctx, pBarX, pBarY, fillW, pBarH, 16);
			ctx.fill();
			ctx.shadowBlur = 0;

			ctx.font = "bold 16px sans-serif";
			ctx.fillStyle = "#ffffff";
			ctx.textAlign = "center";
			ctx.fillText(`NEXT LEVEL IN ${(nextLevelXp - xp).toFixed(0)} XP`, pBarX + pBarW / 2, pBarY + 22);
			ctx.restore();

			ctx.save();
			ctx.font = "bold 22px sans-serif";
			ctx.fillStyle = "#ffffff";
			ctx.shadowColor = "#ff007f";
			ctx.shadowBlur = 12;
			ctx.textAlign = "center";
			ctx.fillText(`${authorClean} CHATBOT * CYBER VIP CARD SYSTEM EDITION`, width / 2, 1030);
			ctx.restore();

			const buffer = canvas.toBuffer("image/png");
			await fs.writeFile(imgPath, buffer);

			const msgStream = fs.createReadStream(imgPath);

			return await message.reply({
				body: "",
				attachment: msgStream
			});

		} catch (err) {
			console.error("Profile Command Error:", err);
			return message.reply("❌ Profile Card তৈরি করতে ব্যর্থ হয়েছে!");
		} finally {
			setTimeout(() => {
				if (fs.existsSync(imgPath)) {
					fs.unlinkSync(imgPath);
				}
			}, 5000);
		}
	}
};
