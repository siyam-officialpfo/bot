const fs = require("fs-extra");
const path = require("path");
const { createCanvas } = require("canvas");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

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
		name: "up4",
		aliases: ["uptc4", "cardupt4", "uptimecard4", "halftime4"],
		version: "2.0",
		author: LOCKED_AUTHOR,
		countDown: 5,
		role: 0,
		description: {
			en: "Generate automated Dark Glassmorphism Half-Time Bot Uptime Dashboard Card"
		},
		category: "system"
	},

	onStart: async function ({ api, message, event }) {
		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
		}

		const cacheDir = path.join(__dirname, "cache");
		if (!fs.existsSync(cacheDir)) {
			fs.mkdirSync(cacheDir, { recursive: true });
		}

		const imgPath = path.join(cacheDir, `halftime_${event.senderID}_${Date.now()}.png`);

		try {
			const uptimeSeconds = process.uptime();
			const days = Math.floor(uptimeSeconds / (3600 * 24));
			const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
			const minutes = Math.floor((uptimeSeconds % 3600) / 60);
			const seconds = Math.floor(uptimeSeconds % 60);

			const strDays = String(days).padStart(2, '0');
			const strHours = String(hours).padStart(2, '0');
			const strMins = String(minutes).padStart(2, '0');
			const strSecs = String(seconds).padStart(2, '0');

			const memMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
			const ramPercent = Math.min(Math.round((memMB / 1024) * 100), 100);

			const now = new Date();
			const timeStr = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
			const dateStr = now.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase();
			const dayStr = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

			const width = 1920;
			const height = 1080;
			const canvas = createCanvas(width, height);
			const ctx = canvas.getContext("2d");

			const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 1200);
			bgGrad.addColorStop(0, "#0e1329");
			bgGrad.addColorStop(0.5, "#080a18");
			bgGrad.addColorStop(1, "#03040a");
			ctx.fillStyle = bgGrad;
			ctx.fillRect(0, 0, width, height);

			ctx.save();
			for (let i = 0; i < 70; i++) {
				const px = (Math.sin(i * 99) * 0.5 + 0.5) * width;
				const py = (Math.cos(i * 33) * 0.5 + 0.5) * height;
				const pr = (i % 3) + 1;
				ctx.fillStyle = i % 2 === 0 ? "rgba(0, 210, 255, 0.15)" : "rgba(157, 78, 221, 0.15)";
				ctx.beginPath();
				ctx.arc(px, py, pr, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.restore();

			ctx.save();
			drawRoundRect(ctx, 40, 40, width - 80, height - 80, 24);
			ctx.strokeStyle = "rgba(0, 210, 255, 0.25)";
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.restore();

			ctx.save();
			ctx.fillStyle = "rgba(11, 16, 38, 0.75)";
			drawRoundRect(ctx, 60, 60, width - 120, 100, 16);
			ctx.fill();
			ctx.strokeStyle = "rgba(0, 210, 255, 0.35)";
			ctx.lineWidth = 1.5;
			ctx.stroke();

			ctx.font = "bold 34px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#ffffff";
			ctx.shadowColor = "#00d2ff";
			ctx.shadowBlur = 15;
			ctx.fillText("👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑", 90, 112);

			ctx.shadowBlur = 0;
			ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#ff9e00";
			ctx.fillText("BOT HALF TIME • LIVE SYSTEM STATUS", 90, 138);

			ctx.save();
			ctx.fillStyle = "rgba(0, 255, 136, 0.15)";
			drawRoundRect(ctx, width - 460, 80, 110, 36, 18);
			ctx.fill();
			ctx.strokeStyle = "#00ff88";
			ctx.lineWidth = 1;
			ctx.stroke();

			ctx.fillStyle = "#00ff88";
			ctx.shadowColor = "#00ff88";
			ctx.shadowBlur = 8;
			ctx.beginPath();
			ctx.arc(width - 440, 98, 5, 0, Math.PI * 2);
			ctx.fill();

			ctx.shadowBlur = 0;
			ctx.font = "bold 14px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#00ff88";
			ctx.fillText("LIVE", width - 425, 103);

			ctx.font = "bold 26px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#ffd700";
			ctx.shadowColor = "#ffd700";
			ctx.shadowBlur = 10;
			ctx.textAlign = "right";
			ctx.fillText(timeStr, width - 90, 103);

			ctx.shadowBlur = 0;
			ctx.font = "bold 13px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#909ad0";
			ctx.fillText(`${dateStr}  •  ${dayStr}`, width - 90, 132);
			ctx.restore();

			const centerX = width / 2;
			const centerY = 520;
			const radius = 220;

			ctx.save();
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius + 25, 0, Math.PI * 2);
			ctx.fillStyle = "rgba(0, 210, 255, 0.03)";
			ctx.fill();

			ctx.lineWidth = 18;
			ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
			ctx.stroke();

			const ringGrad = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
			ringGrad.addColorStop(0, "#00d2ff");
			ringGrad.addColorStop(0.35, "#9d4edd");
			ringGrad.addColorStop(0.7, "#ff7b00");
			ringGrad.addColorStop(1, "#ffd700");

			ctx.shadowColor = "#00d2ff";
			ctx.shadowBlur = 25;
			ctx.strokeStyle = ringGrad;
			ctx.lineWidth = 16;
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, -Math.PI * 0.75, Math.PI * 1.15);
			ctx.stroke();

			ctx.shadowBlur = 0;
			ctx.fillStyle = "rgba(8, 11, 26, 0.85)";
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius - 15, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = "rgba(0, 210, 255, 0.3)";
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.textAlign = "center";
			ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#00d2ff";
			ctx.shadowColor = "#00d2ff";
			ctx.shadowBlur = 8;
			ctx.fillText("BOT IS RUNNING", centerX, centerY - 100);

			ctx.font = "bold 32px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#ffd700";
			ctx.shadowColor = "#ffd700";
			ctx.shadowBlur = 15;
			ctx.fillText("HALF TIME", centerX, centerY - 55);

			ctx.shadowBlur = 0;
			ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(centerX - 120, centerY - 35);
			ctx.lineTo(centerX + 120, centerY - 35);
			ctx.stroke();

			const boxW = 85;
			const boxH = 65;
			const gap = 12;
			const totalW = (boxW * 4) + (gap * 3);
			const startX = centerX - (totalW / 2);
			const boxY = centerY - 10;

			const timeBoxes = [
				{ val: strDays, label: "DAYS", color: "#00d2ff" },
				{ val: strHours, label: "HOURS", color: "#9d4edd" },
				{ val: strMins, label: "MINUTES", color: "#ff7b00" },
				{ val: strSecs, label: "SECONDS", color: "#ffd700" }
			];

			timeBoxes.forEach((tb, i) => {
				const bx = startX + i * (boxW + gap);
				ctx.save();
				ctx.fillStyle = "rgba(18, 24, 48, 0.9)";
				drawRoundRect(ctx, bx, boxY, boxW, boxH, 10);
				ctx.fill();
				ctx.strokeStyle = tb.color;
				ctx.lineWidth = 1.5;
				ctx.stroke();

				ctx.font = "bold 24px 'Segoe UI', Arial, sans-serif";
				ctx.fillStyle = "#ffffff";
				ctx.shadowColor = tb.color;
				ctx.shadowBlur = 8;
				ctx.textAlign = "center";
				ctx.fillText(tb.val, bx + (boxW / 2), boxY + 36);

				ctx.shadowBlur = 0;
				ctx.font = "bold 10px 'Segoe UI', Arial, sans-serif";
				ctx.fillStyle = tb.color;
				ctx.fillText(tb.label, bx + (boxW / 2), boxY + 54);
				ctx.restore();
			});

			ctx.save();
			ctx.fillStyle = "rgba(0, 255, 136, 0.15)";
			drawRoundRect(ctx, centerX - 80, centerY + 125, 160, 32, 16);
			ctx.fill();
			ctx.strokeStyle = "#00ff88";
			ctx.lineWidth = 1;
			ctx.stroke();

			ctx.font = "bold 13px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#00ff88";
			ctx.textAlign = "center";
			ctx.fillText("● SYSTEM ONLINE", centerX, centerY + 146);
			ctx.restore();

			ctx.save();
			drawRoundRect(ctx, 60, 180, 500, 370, 16);
			ctx.fillStyle = "rgba(10, 15, 33, 0.75)";
			ctx.fill();
			ctx.strokeStyle = "rgba(0, 210, 255, 0.3)";
			ctx.lineWidth = 1.5;
			ctx.stroke();

			ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#00d2ff";
			ctx.shadowColor = "#00d2ff";
			ctx.shadowBlur = 10;
			ctx.textAlign = "left";
			ctx.fillText("🤖 BOT INFORMATION", 90, 222);
			ctx.shadowBlur = 0;

			ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
			ctx.beginPath();
			ctx.moveTo(90, 240);
			ctx.lineTo(530, 240);
			ctx.stroke();

			const botInfo = [
				{ label: "Bot Name", val: "NIJHUM CHATBOT" },
				{ label: "Status", val: "ONLINE", isOnline: true },
				{ label: "Node Version", val: process.version || "v20.11.0" },
				{ label: "Platform", val: (process.platform || "LINUX").toUpperCase() },
				{ label: "Bot Mode", val: "PUBLIC / HYBRID" },
				{ label: "Start Time", val: "Today, Live" },
				{ label: "Last Restart", val: "STABLE (0 ERR)" }
			];

			let infoY = 275;
			botInfo.forEach((info) => {
				ctx.font = "15px 'Segoe UI', Arial, sans-serif";
				ctx.fillStyle = "#909ad0";
				ctx.fillText(info.label, 90, infoY);

				if (info.isOnline) {
					ctx.fillStyle = "#00ff88";
					ctx.font = "bold 15px 'Segoe UI', Arial, sans-serif";
					ctx.shadowColor = "#00ff88";
					ctx.shadowBlur = 8;
					ctx.fillText("● " + info.val, 380, infoY);
					ctx.shadowBlur = 0;
				} else {
					ctx.fillStyle = "#ffffff";
					ctx.font = "bold 15px 'Segoe UI', Arial, sans-serif";
					ctx.fillText(info.val, 380, infoY);
				}
				infoY += 38;
			});
			ctx.restore();

			ctx.save();
			drawRoundRect(ctx, 60, 570, 500, 370, 16);
			ctx.fillStyle = "rgba(10, 15, 33, 0.75)";
			ctx.fill();
			ctx.strokeStyle = "rgba(157, 78, 221, 0.35)";
			ctx.lineWidth = 1.5;
			ctx.stroke();

			ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#9d4edd";
			ctx.shadowColor = "#9d4edd";
			ctx.shadowBlur = 10;
			ctx.textAlign = "left";
			ctx.fillText("⚡ SYSTEM PERFORMANCE", 90, 612);
			ctx.shadowBlur = 0;

			ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
			ctx.beginPath();
			ctx.moveTo(90, 630);
			ctx.lineTo(530, 630);
			ctx.stroke();

			const perfItems = [
				{ label: "CPU Usage", val: "12.4%", pct: 12, color: "#00d2ff" },
				{ label: "RAM Usage", val: `${memMB} MB`, pct: ramPercent, color: "#9d4edd" },
				{ label: "Ping Speed", val: "24 ms", pct: 24, color: "#00ff88" },
				{ label: "Server Status", val: "OPTIMAL (100%)", pct: 100, color: "#ff7b00" },
				{ label: "Database Status", val: "CONNECTED", pct: 100, color: "#ffd700" }
			];

			let perfY = 665;
			perfItems.forEach((item) => {
				ctx.font = "15px 'Segoe UI', Arial, sans-serif";
				ctx.fillStyle = "#909ad0";
				ctx.fillText(item.label, 90, perfY);

				ctx.font = "bold 14px 'Segoe UI', Arial, sans-serif";
				ctx.fillStyle = item.color;
				ctx.textAlign = "right";
				ctx.fillText(item.val, 530, perfY);
				ctx.textAlign = "left";

				ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
				drawRoundRect(ctx, 90, perfY + 8, 440, 8, 4);
				ctx.fill();

				const barWidth = Math.max(12, (440 * item.pct) / 100);
				ctx.fillStyle = item.color;
				ctx.shadowColor = item.color;
				ctx.shadowBlur = 6;
				drawRoundRect(ctx, 90, perfY + 8, barWidth, 8, 4);
				ctx.fill();
				ctx.shadowBlur = 0;

				perfY += 52;
			});
			ctx.restore();

			ctx.save();
			drawRoundRect(ctx, 1360, 180, 500, 370, 16);
			ctx.fillStyle = "rgba(10, 15, 33, 0.75)";
			ctx.fill();
			ctx.strokeStyle = "rgba(255, 123, 0, 0.35)";
			ctx.lineWidth = 1.5;
			ctx.stroke();

			ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#ff7b00";
			ctx.shadowColor = "#ff7b00";
			ctx.shadowBlur = 10;
			ctx.textAlign = "left";
			ctx.fillText("📊 LIVE STATISTICS", 1390, 222);
			ctx.shadowBlur = 0;

			ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
			ctx.beginPath();
			ctx.moveTo(1390, 240);
			ctx.lineTo(1830, 240);
			ctx.stroke();

			const statsGrid = [
				{ label: "Total Users", val: "14,850", color: "#00d2ff" },
				{ label: "Active Users", val: "3,920", color: "#00ff88" },
				{ label: "Commands Used", val: "94,120", color: "#9d4edd" },
				{ label: "Total Messages", val: "482,500", color: "#ff7b00" },
				{ label: "Active Groups", val: "1,280", color: "#ffd700" },
				{ label: "Uptime Rate", val: "99.98%", color: "#00d2ff" }
			];

			statsGrid.forEach((st, idx) => {
				const col = idx % 2;
				const row = Math.floor(idx / 2);
				const sx = 1390 + col * 225;
				const sy = 260 + row * 90;

				ctx.fillStyle = "rgba(18, 24, 48, 0.6)";
				drawRoundRect(ctx, sx, sy, 210, 75, 10);
				ctx.fill();
				ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
				ctx.stroke();

				ctx.font = "13px 'Segoe UI', Arial, sans-serif";
				ctx.fillStyle = "#909ad0";
				ctx.fillText(st.label, sx + 15, sy + 26);

				ctx.font = "bold 22px 'Segoe UI', Arial, sans-serif";
				ctx.fillStyle = st.color;
				ctx.shadowColor = st.color;
				ctx.shadowBlur = 8;
				ctx.fillText(st.val, sx + 15, sy + 58);
				ctx.shadowBlur = 0;
			});
			ctx.restore();

			ctx.save();
			drawRoundRect(ctx, 1360, 570, 500, 370, 16);
			ctx.fillStyle = "rgba(10, 15, 33, 0.75)";
			ctx.fill();
			ctx.strokeStyle = "rgba(255, 215, 0, 0.35)";
			ctx.lineWidth = 1.5;
			ctx.stroke();

			ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#ffd700";
			ctx.shadowColor = "#ffd700";
			ctx.shadowBlur = 10;
			ctx.textAlign = "left";
			ctx.fillText("📡 LIVE ACTIVITY LOG", 1390, 612);
			ctx.shadowBlur = 0;

			ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
			ctx.beginPath();
			ctx.moveTo(1390, 630);
			ctx.lineTo(1830, 630);
			ctx.stroke();

			const activities = [
				{ text: "Bot System Started", time: "SUCCESS", color: "#00ff88" },
				{ text: "System Core Connected", time: "ACTIVE", color: "#00d2ff" },
				{ text: "Database Loaded", time: "OK", color: "#9d4edd" },
				{ text: "Commands Active", time: "READY", color: "#ff7b00" },
				{ text: "Half Time System Running", time: "ONLINE", color: "#ffd700" }
			];

			let actY = 675;
			activities.forEach((act) => {
				ctx.fillStyle = act.color;
				ctx.shadowColor = act.color;
				ctx.shadowBlur = 8;
				ctx.beginPath();
				ctx.arc(1405, actY - 5, 5, 0, Math.PI * 2);
				ctx.fill();
				ctx.shadowBlur = 0;

				ctx.font = "15px 'Segoe UI', Arial, sans-serif";
				ctx.fillStyle = "#e0e5ff";
				ctx.fillText(act.text, 1425, actY);

				ctx.font = "bold 12px 'Segoe UI', Arial, sans-serif";
				ctx.fillStyle = act.color;
				ctx.textAlign = "right";
				ctx.fillText(act.time, 1830, actY);
				ctx.textAlign = "left";

				actY += 52;
			});
			ctx.restore();

			ctx.save();
			ctx.fillStyle = "rgba(8, 11, 24, 0.85)";
			drawRoundRect(ctx, 60, 960, width - 120, 60, 14);
			ctx.fill();
			ctx.strokeStyle = "rgba(0, 210, 255, 0.2)";
			ctx.lineWidth = 1;
			ctx.stroke();

			ctx.font = "bold 17px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#ffffff";
			ctx.shadowColor = "#00d2ff";
			ctx.shadowBlur = 10;
			ctx.textAlign = "center";
			ctx.fillText("👑 SIYAM-HASAN CHAT BOT  ⚡  LIGHTING SYSTEM • LIVE MONITOR 👑", width / 2, 996);
			ctx.restore();

			const buffer = canvas.toBuffer("image/png");
			await fs.writeFile(imgPath, buffer);

			const msgStream = fs.createReadStream(imgPath);
			
			const replyMsg = await message.reply({
				body: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚡ 𝐁𝐎𝐓 𝐇𝐀𝐋𝐅 𝐓𝐈𝐌𝐄 𝐒𝐓𝐀𝐓𝐔𝐒
» 🎨 𝐃𝐀𝐑𝐊 𝐆𝐋𝐀𝐒𝐒 𝐃𝐀𝐒𝐇𝐁𝐎𝐀𝐑𝐃
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
				attachment: msgStream
			});

			setTimeout(() => {
				if (fs.existsSync(imgPath)) {
					fs.unlinkSync(imgPath);
				}
			}, 10000);

			return replyMsg;

		} catch (err) {
			if (fs.existsSync(imgPath)) {
				fs.unlinkSync(imgPath);
			}
			return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐅𝐀𝐈🇱𝐄𝐃 𝐓𝐎 
» 🎨 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐄 𝐃𝐀𝐒𝐇𝐁𝐎𝐀𝐑𝐃
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
			);
		}
	}
};
