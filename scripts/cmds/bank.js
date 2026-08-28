const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const BOT_NAME = "NIJHUM CHATBOT";

function drawFittedText(ctx, text, x, y, maxWidth, baseSize, fontFace, color, align = "left") {
	let fontSize = baseSize;
	ctx.save();
	ctx.font = `bold ${fontSize}px ${fontFace}`;
	ctx.textAlign = align;
	
	while (ctx.measureText(text).width > maxWidth && fontSize > 14) {
		fontSize -= 2;
		ctx.font = `bold ${fontSize}px ${fontFace}`;
	}
	
	ctx.fillStyle = color;
	ctx.fillText(text, x, y);
	ctx.restore();
}

function drawRoundRect(ctx, x, y, width, height, radius) {
	if (typeof radius === 'number') {
		radius = { tl: radius, tr: radius, br: radius, bl: radius };
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
		name: "bank",
		aliases: ["ব্যাংক", "ব্যালেন্স", "wallet", "money"],
		version: "6.0",
		author: LOCKED_AUTHOR,
		countDown: 5,
		role: 0,
		description: {
			en: "Generate Ultra VIP Royal Gold Dynamic Bank Statement"
		},
		category: "economy"
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
		const imgPath = path.join(cacheDir, `bank_vip_${targetID}_${Date.now()}.png`);

		try {
			const userData = (await usersData.get(targetID)) || {};
			const rawName = userData.name || (event.mentions ? event.mentions[targetID] : "VIP USER");
			const userName = rawName.replace(/[\r\n]+/g, " ").trim();

			const bankMoney = userData.bank || userData.money || 125000;
			const cashMoney = userData.cash || Math.floor(bankMoney * 0.15);
			const creditScore = Math.min(850, 650 + Math.floor((bankMoney % 200)));
			
			const formattedBank = bankMoney.toLocaleString("en-US");
			const formattedCash = cashMoney.toLocaleString("en-US");
			const maskedCardNo = `4892 •••• •••• ${targetID.slice(-4)}`;
			const avatarLink = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

			const width = 1600;
			const height = 980;
			const canvas = createCanvas(width, height);
			const ctx = canvas.getContext("2d");

			const mainBg = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, 950);
			mainBg.addColorStop(0, "#2a1f06");
			mainBg.addColorStop(0.4, "#0f0c07");
			mainBg.addColorStop(0.8, "#050505");
			mainBg.addColorStop(1, "#000000");
			ctx.fillStyle = mainBg;
			ctx.fillRect(0, 0, width, height);

			const glow1 = ctx.createRadialGradient(250, 200, 10, 250, 200, 450);
			glow1.addColorStop(0, "rgba(212, 175, 55, 0.25)");
			glow1.addColorStop(1, "rgba(0, 0, 0, 0)");
			ctx.fillStyle = glow1;
			ctx.fillRect(0, 0, width, height);

			const glow2 = ctx.createRadialGradient(width - 250, height - 200, 10, width - 250, height - 200, 450);
			glow2.addColorStop(0, "rgba(6, 182, 212, 0.15)");
			glow2.addColorStop(1, "rgba(0, 0, 0, 0)");
			ctx.fillStyle = glow2;
			ctx.fillRect(0, 0, width, height);

			const cX = 50;
			const cY = 50;
			const cW = width - 100;
			const cH = height - 100;

			ctx.save();
			drawRoundRect(ctx, cX, cY, cW, cH, 32);
			const cardBg = ctx.createLinearGradient(cX, cY, cX + cW, cY + cH);
			cardBg.addColorStop(0, "#161412");
			cardBg.addColorStop(0.5, "#0b0a09");
			cardBg.addColorStop(1, "#141210");
			ctx.fillStyle = cardBg;
			ctx.fill();

			const goldBorder = ctx.createLinearGradient(cX, cY, cX + cW, cY + cH);
			goldBorder.addColorStop(0, "#ffe57f");
			goldBorder.addColorStop(0.3, "#d4af37");
			goldBorder.addColorStop(0.6, "#aa771c");
			goldBorder.addColorStop(1, "#fbf5b7");
			ctx.strokeStyle = goldBorder;
			ctx.lineWidth = 5;
			ctx.shadowColor = "#d4af37";
			ctx.shadowBlur = 20;
			ctx.stroke();
			ctx.restore();

			const chipX = cX + 60;
			const chipY = cY + 160;
			const chipW = 120;
			const chipH = 90;

			ctx.save();
			drawRoundRect(ctx, chipX, chipY, chipW, chipH, 14);
			const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
			chipGrad.addColorStop(0, "#fff176");
			chipGrad.addColorStop(0.5, "#f57f17");
			chipGrad.addColorStop(1, "#ffb300");
			ctx.fillStyle = chipGrad;
			ctx.fill();
			ctx.strokeStyle = "#fff";
			ctx.lineWidth = 1;
			ctx.stroke();

			ctx.strokeStyle = "rgba(0,0,0,0.5)";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(chipX + 40, chipY); ctx.lineTo(chipX + 40, chipY + chipH);
			ctx.moveTo(chipX + 80, chipY); ctx.lineTo(chipX + 80, chipY + chipH);
			ctx.moveTo(chipX, chipY + 45); ctx.lineTo(chipX + chipW, chipY + 45);
			ctx.stroke();
			ctx.restore();

			drawFittedText(ctx, "ROYAL BANK OF VIP", cX + 60, cY + 85, 800, 48, "Arial, sans-serif", "#fcf6ba");
			drawFittedText(ctx, "OWNER: SIYAM-HASAN  •  OFFICIAL FINANCIAL CARD", cX + 60, cY + 122, 700, 18, "sans-serif", "#a1a1aa");

			const avSize = 270;
			const avX = cX + cW - avSize - 60;
			const avY = cY + 60;

			ctx.save();
			ctx.beginPath();
			ctx.arc(avX + avSize / 2, avY + avSize / 2, avSize / 2 + 8, 0, Math.PI * 2);
			ctx.strokeStyle = goldBorder;
			ctx.lineWidth = 6;
			ctx.shadowColor = "#d4af37";
			ctx.shadowBlur = 25;
			ctx.stroke();
			ctx.restore();

			try {
				const avatarImg = await loadImage(avatarLink);
				ctx.save();
				ctx.beginPath();
				ctx.arc(avX + avSize / 2, avY + avSize / 2, avSize / 2, 0, Math.PI * 2);
				ctx.clip();
				ctx.drawImage(avatarImg, avX, avY, avSize, avSize);
				ctx.restore();
			} catch (e) {
				ctx.save();
				ctx.fillStyle = "#27272a";
				ctx.beginPath();
				ctx.arc(avX + avSize / 2, avY + avSize / 2, avSize / 2, 0, Math.PI * 2);
				ctx.fill();
				ctx.restore();
			}

			ctx.save();
			ctx.font = "bold 42px monospace";
			ctx.fillStyle = "#ffffff";
			ctx.shadowColor = "rgba(0,0,0,0.9)";
			ctx.shadowBlur = 10;
			ctx.fillText(maskedCardNo, cX + 60, cY + 315);
			ctx.restore();

			const bY = cY + 375;

			ctx.save();
			drawRoundRect(ctx, cX + 60, bY, 700, 185, 24);
			ctx.fillStyle = "rgba(24, 24, 27, 0.85)";
			ctx.fill();
			ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
			ctx.lineWidth = 2;
			ctx.stroke();

			drawFittedText(ctx, "TOTAL BANK BALANCE", cX + 90, bY + 50, 600, 20, "sans-serif", "#a1a1aa");
			drawFittedText(ctx, `$${formattedBank}`, cX + 90, bY + 130, 640, 58, "sans-serif", "#fcf6ba");
			ctx.restore();

			const smallW = 340;
			ctx.save();
			drawRoundRect(ctx, cX + 790, bY, smallW, 185, 24);
			ctx.fillStyle = "rgba(24, 24, 27, 0.85)";
			ctx.fill();
			ctx.strokeStyle = "rgba(34, 197, 94, 0.4)";
			ctx.lineWidth = 2;
			ctx.stroke();

			drawFittedText(ctx, "POCKET CASH", cX + 820, bY + 50, 280, 18, "sans-serif", "#a1a1aa");
			drawFittedText(ctx, `$${formattedCash}`, cX + 820, bY + 125, 300, 38, "sans-serif", "#4ade80");
			ctx.restore();

			ctx.save();
			drawRoundRect(ctx, cX + 1155, bY, smallW, 185, 24);
			ctx.fillStyle = "rgba(24, 24, 27, 0.85)";
			ctx.fill();
			ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
			ctx.lineWidth = 2;
			ctx.stroke();

			drawFittedText(ctx, "CREDIT SCORE", cX + 1185, bY + 50, 280, 18, "sans-serif", "#a1a1aa");
			drawFittedText(ctx, `${creditScore} / 850`, cX + 1185, bY + 125, 300, 38, "sans-serif", "#60a5fa");
			ctx.restore();

			const infoY = cY + 615;

			drawFittedText(ctx, "CARD HOLDER NAME", cX + 60, infoY, 500, 18, "sans-serif", "#71717a");
			drawFittedText(ctx, userName.toUpperCase(), cX + 60, infoY + 45, 600, 34, "Segoe UI, Arial, sans-serif", "#ffffff");

			drawFittedText(ctx, "ACCOUNT STATUS", cX + 700, infoY, 400, 18, "sans-serif", "#71717a");
			drawFittedText(ctx, "DIAMOND VIP MEMBER", cX + 700, infoY + 45, 450, 30, "sans-serif", "#fcf6ba");

			drawFittedText(ctx, "SYSTEM STATUS", cX + 1200, infoY, 300, 18, "sans-serif", "#71717a");
			drawFittedText(ctx, "VERIFIED ●", cX + 1200, infoY + 45, 250, 28, "sans-serif", "#22c55e");

			ctx.save();
			const footerY = height - 85;
			ctx.strokeStyle = "rgba(255,255,255,0.1)";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(cX + 60, footerY - 25);
			ctx.lineTo(cX + cW - 60, footerY - 25);
			ctx.stroke();

			drawFittedText(ctx, `POWERED BY ${BOT_NAME}  |  DEVELOPED BY ${LOCKED_AUTHOR.replace(/[^\x20-\x7E]/g, '')}`, width / 2, footerY + 15, cW - 100, 22, "sans-serif", "#d4af37", "center");
			ctx.restore();

			const buffer = canvas.toBuffer("image/png");
			await fs.writeFile(imgPath, buffer);

			const msgStream = fs.createReadStream(imgPath);

			const replyText = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💳 𝐑𝐎𝐘𝐀𝐋 𝐁𝐀𝐍𝐊
» 🤩 𝐎𝐅 𝐕𝐈𝐏 𝐒𝐓𝐀𝐓𝐄𝐌𝐄𝐍𝐓

» 👤 𝐔𝐒𝐄𝐑 ${userName}
» 💰 𝐁𝐀𝐍𝐊 𝐁𝐀𝐋𝐀𝐍𝐂𝐄:
» 🧞‍♂️ $${formattedBank}
» 💵 𝐏𝐎𝐂𝐊𝐄𝐓 𝐂𝐀𝐒𝐇: $${formattedCash}
» 📈 𝐂𝐑𝐄𝐃𝐈𝐓 𝐒𝐂𝐎𝐑𝐄: ${creditScore}/850
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓`;

			return await message.reply({
				body: replyText,
				attachment: msgStream
			});

		} catch (err) {
			console.error("Bank Card Error:", err);
			return message.reply("❌ ব্যাংক কার্ড ফাইল তৈরি করতে সমস্যা হয়েছে!");
		} finally {
			setTimeout(() => {
				if (fs.existsSync(imgPath)) {
					fs.unlinkSync(imgPath);
				}
			}, 5000);
		}
	}
};
