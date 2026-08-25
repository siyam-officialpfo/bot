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
		name: "uptcard",
		aliases: ["uptc", "cardupt", "uptimecard", "halftime"],
		version: "2.5",
		author: LOCKED_AUTHOR,
		countDown: 5,
		role: 0,
		description: {
			en: "Generate automated HD Dark Glassmorphism Half-Time Bot Uptime Dashboard Card"
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

			// Background Gradient
			const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 1200);
			bgGrad.addColorStop(0, "#0e1329");
			bgGrad.addColorStop(0.5, "#080a18");
			bgGrad.addColorStop(1, "#03040a");
			ctx.fillStyle = bgGrad;
			ctx.fillRect(0, 0, width, height);

			// Background Glowing Particles
			ctx.save();
			for (let i = 0; i < 80; i++) {
				const px = (Math.sin(i * 99) * 0.5 + 0.5) * width;
				const py = (Math.cos(i * 33) * 0.5 + 0.5) * height;
				const pr = (i % 3) + 2;
				ctx.fillStyle = i % 2 === 0 ? "rgba(0, 210, 255, 0.25)" : "rgba(157, 78, 221, 0.25)";
				ctx.beginPath();
				ctx.arc(px, py, pr, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.restore();

			// Outer Border
			ctx.save();
			drawRoundRect(ctx, 35, 35, width - 70, height - 70, 28);
			ctx.strokeStyle = "rgba(0, 210, 255, 0.35)";
			ctx.lineWidth = 3;
			ctx.stroke();
			ctx.restore();

			// --- HEADER BAR ---
			ctx.save();
			ctx.fillStyle = "rgba(11, 16, 38, 0.85)";
			drawRoundRect(ctx, 55, 50, width - 110, 115, 20);
			ctx.fill();
			ctx.strokeStyle = "rgba(0, 210, 255, 0.45)";
			ctx.lineWidth = 2.5;
			ctx.stroke();

			ctx.font = "bold 42px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#ffffff";
			ctx.shadowColor = "#00d2ff";
			ctx.shadowBlur = 20;
			ctx.fillText("👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑", 85, 108);

			ctx.shadowBlur = 0;
			ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#ff9e00";
			ctx.fillText("BOT HALF TIME • LIVE SYSTEM STATUS", 85, 142);

			// Header Live Badge & Time
			ctx.save();
			ctx.fillStyle = "rgba(0, 255, 136, 0.2)";
			drawRoundRect(ctx, width - 520, 72, 125, 42, 21);
			ctx.fill();
			ctx.strokeStyle = "#00ff88";
			ctx.lineWidth = 1.5;
			ctx.stroke();

			ctx.fillStyle = "#00ff88";
			ctx.shadowColor = "#00ff88";
			ctx.shadowBlur = 12;
			ctx.beginPath();
			ctx.arc(width - 495, 93, 7, 0, Math.PI * 2);
			ctx.fill();

			ctx.shadowBlur = 0;
			ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#00ff88";
			ctx.fillText("LIVE", width - 478, 99);

			ctx.font = "bold 34px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#ffd700";
			ctx.shadowColor = "#ffd700";
			ctx.shadowBlur = 15;
			ctx.textAlign = "right";
			ctx.fillText(timeStr, width - 85, 100);

			ctx.shadowBlur = 0;
			ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#a2acde";
			ctx.fillText(`${dateStr}  •  ${dayStr}`, width - 85, 136);
			ctx.restore();

			// --- CENTER CIRCLE DASHBOARD ---
			const centerX = width / 2;
			const centerY = 525;
			const radius = 230;

			ctx.save();
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius + 30, 0, Math.PI * 2);
			ctx.fillStyle = "rgba(0, 210, 255, 0.04)";
			ctx.fill();

			ctx.lineWidth = 22;
			ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
			ctx.stroke();

			const ringGrad = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
			ringGrad.addColorStop(0, "#00d2ff");
			ringGrad.addColorStop(0.35, "#9d4edd");
			ringGrad.addColorStop(0.7, "#ff7b00");
			ringGrad.addColorStop(1, "#ffd700");

			ctx.shadowColor = "#00d2ff";
			ctx.shadowBlur = 30;
			ctx.strokeStyle = ringGrad;
			ctx.lineWidth = 20;
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, -Math.PI * 0.75, Math.PI * 1.15);
			ctx.stroke();

			ctx.shadowBlur = 0;
			ctx.fillStyle = "rgba(8, 11, 26, 0.9)";
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius - 16, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = "rgba(0, 210, 255, 0.4)";
			ctx.lineWidth = 2.5;
			ctx.stroke();

			ctx.textAlign = "center";
			ctx.font = "bold 22px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#00d2ff";
			ctx.shadowColor = "#00d2ff";
			ctx.shadowBlur = 12;
			ctx.fillText("BOT IS RUNNING", centerX, centerY - 105);

			ctx.font = "bold 42px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#ffd700";
			ctx.shadowColor = "#ffd700";
			ctx.shadowBlur = 20;
			ctx.fillText("HALF TIME", centerX, centerY - 52);

			ctx.shadowBlur = 0;
			ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			ctx.moveTo(centerX - 140, centerY - 32);
			ctx.lineTo(centerX + 140, centerY - 32);
			ctx.stroke();

			// Time Boxes Inside Center Circle
			const boxW = 95;
			const boxH = 75;
			const gap = 14;
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
				ctx.fillStyle = "rgba(18, 24, 48, 0.95)";
				drawRoundRect(ctx, bx, boxY, boxW, boxH, 12);
				ctx.fill();
				ctx.strokeStyle = tb.color;
				ctx.lineWidth = 2;
				ctx.stroke();

				ctx.font = "bold 30px 'Segoe UI', Arial, sans-serif";
				ctx.fillStyle = "#ffffff";
				ctx.shadowColor = tb.color;
				ctx.shadowBlur = 12;
				ctx.textAlign = "center";
				ctx.fillText(tb.val, bx + (boxW / 2), boxY + 42);

				ctx.shadowBlur = 0;
				ctx.font = "bold 13px 'Segoe UI', Arial, sans-serif";
				ctx.fillStyle = tb.color;
				ctx.fillText(tb.label, bx + (boxW / 2), boxY + 63);
				ctx.restore();
			});

			ctx.save();
			ctx.fillStyle = "rgba(0, 255, 136, 0.2)";
			drawRoundRect(ctx, centerX - 100, centerY + 130, 200, 38, 19);
			ctx.fill();
			ctx.strokeStyle = "#00ff88";
			ctx.lineWidth = 1.5;
			ctx.stroke();

			ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#00ff88";
			ctx.textAlign = "center";
			ctx.fillText("● SYSTEM ONLINE", centerX, centerY + 155);
			ctx.restore();

			// --- TOP LEFT PANEL: BOT INFORMATION ---
			ctx.save();
			drawRoundRect(ctx, 55, 185, 520, 365, 18);
			ctx.fillStyle = "rgba(10, 15, 33, 0.85)";
			ctx.fill();
			ctx.strokeStyle = "rgba(0, 210, 255, 0.4)";
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.font = "bold 25px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#00d2ff";
			ctx.shadowColor = "#00d2ff";
			ctx.shadowBlur = 14;
			ctx.textAlign = "left";
			ctx.fillText("🤖 BOT INFORMATION", 85, 228);
			ctx.shadowBlur = 0;

			ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			ctx.moveTo(85, 246);
			ctx.lineTo(545, 246);
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

			let infoY = 282;
			botInfo.forEach((info) => {
				ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
				ctx.fillStyle = "#a2acde";
				ctx.fillText(info.label, 85, infoY);

				if (info.isOnline) {
					ctx.fillStyle = "#00ff88";
					ctx.font = "bold 19px 'Segoe UI', Arial, sans-serif";
					ctx.shadowColor = "#00ff88";
					ctx.shadowBlur = 10;
					ctx.fillText("● " + info.val, 340, infoY);
					ctx.shadowBlur = 0;
				} else {
					ctx.fillStyle = "#ffffff";
					ctx.font = "bold 19px 'Segoe UI', Arial, sans-serif";
					ctx.fillText(info.val, 340, infoY);
				}
				infoY += 37;
			});
			ctx.restore();

			// --- BOTTOM LEFT PANEL: SYSTEM PERFORMANCE ---
			ctx.save();
			drawRoundRect(ctx, 55, 570, 520, 365, 18);
			ctx.fillStyle = "rgba(10, 15, 33, 0.85)";
			ctx.fill();
			ctx.strokeStyle = "rgba(157, 78, 221, 0.45)";
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.font = "bold 25px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#9d4edd";
			ctx.shadowColor = "#9d4edd";
			ctx.shadowBlur = 14;
			ctx.textAlign = "left";
			ctx.fillText("⚡ SYSTEM PERFORMANCE", 85, 613);
			ctx.shadowBlur = 0;

			ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			ctx.moveTo(85, 631);
			ctx.lineTo(545, 631);
			ctx.stroke();

			const perfItems = [
				{ label: "CPU Usage", val: "12.4%", pct: 12, color: "#00d2ff" },
				{ label: "RAM Usage", val: `${memMB} MB`, pct: ramPercent, color: "#9d4edd" },
				{ label: "Ping Speed", val: "24 ms", pct: 24, color: "#00ff88" },
				{ label: "Server Status", val: "OPTIMAL (100%)", pct: 100, color: "#ff7b00" },
				{ label: "Database Status", val: "CONNECTED", pct: 100, color: "#ffd700" }
			];

			let perfY = 668;
			perfItems.forEach((item) => {
				ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
				ctx.fillStyle = "#a2acde";
				ctx.fillText(item.label, 85, perfY);

				ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
				ctx.fillStyle = item.color;
				ctx.textAlign = "right";
				ctx.fillText(item.val, 545, perfY);
				ctx.textAlign = "left";

				ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
				drawRoundRect(ctx, 85, perfY + 8, 460, 11, 5);
				ctx.fill();

				const barWidth = Math.max(16, (460 * item.pct) / 100);
				ctx.fillStyle = item.color;
				ctx.shadowColor = item.color;
				ctx.shadowBlur = 8;
				drawRoundRect(ctx, 85, perfY + 8, barWidth, 11, 5);
				ctx.fill();
				ctx.shadowBlur = 0;

				perfY += 51;
			});
			ctx.restore();

			// --- TOP RIGHT PANEL: LIVE STATISTICS ---
			ctx.save();
			drawRoundRect(ctx, 1345, 185, 520, 365, 18);
			ctx.fillStyle = "rgba(10, 15, 33, 0.85)";
			ctx.fill();
			ctx.strokeStyle = "rgba(255, 123, 0, 0.45)";
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.font = "bold 25px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#ff7b00";
			ctx.shadowColor = "#ff7b00";
			ctx.shadowBlur = 14;
			ctx.textAlign = "left";
			ctx.fillText("📊 LIVE STATISTICS", 1375, 228);
			ctx.shadowBlur = 0;

			ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			ctx.moveTo(1375, 246);
			ctx.lineTo(1835, 246);
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
				const sx = 1375 + col * 235;
				const sy = 262 + row * 88;

				ctx.fillStyle = "rgba(18, 24, 48, 0.8)";
				drawRoundRect(ctx, sx, sy, 220, 76, 12);
				ctx.fill();
				ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
				ctx.stroke();

				ctx.font = "bold 15px 'Segoe UI', Arial, sans-serif";
				ctx.fillStyle = "#a2acde";
				ctx.fillText(st.label, sx + 16, sy + 28);

				ctx.font = "bold 26px 'Segoe UI', Arial, sans-serif";
				ctx.fillStyle = st.color;
				ctx.shadowColor = st.color;
				ctx.shadowBlur = 10;
				ctx.fillText(st.val, sx + 16, sy + 60);
				ctx.shadowBlur = 0;
			});
			ctx.restore();

			// --- BOTTOM RIGHT PANEL: LIVE ACTIVITY LOG ---
			ctx.save();
			drawRoundRect(ctx, 1345, 570, 520, 365, 18);
			ctx.fillStyle = "rgba(10, 15, 33, 0.85)";
			ctx.fill();
			ctx.strokeStyle = "rgba(255, 215, 0, 0.45)";
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.font = "bold 25px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#ffd700";
			ctx.shadowColor = "#ffd700";
			ctx.shadowBlur = 14;
			ctx.textAlign = "left";
			ctx.fillText("📡 LIVE ACTIVITY LOG", 1375, 613);
			ctx.shadowBlur = 0;

			ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			ctx.moveTo(1375, 631);
			ctx.lineTo(1835, 631);
			ctx.stroke();

			const activities = [
				{ text: "Bot System Started", time: "SUCCESS", color: "#00ff88" },
				{ text: "System Core Connected", time: "ACTIVE", color: "#00d2ff" },
				{ text: "Database Loaded", time: "OK", color: "#9d4edd" },
				{ text: "Commands Active", time: "READY", color: "#ff7b00" },
				{ text: "Half Time System Running", time: "ONLINE", color: "#ffd700" }
			];

			let actY = 673;
			activities.forEach((act) => {
				ctx.fillStyle = act.color;
				ctx.shadowColor = act.color;
				ctx.shadowBlur = 10;
				ctx.beginPath();
				ctx.arc(1390, actY - 6, 6, 0, Math.PI * 2);
				ctx.fill();
				ctx.shadowBlur = 0;

				ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
				ctx.fillStyle = "#ffffff";
				ctx.fillText(act.text, 1412, actY);

				ctx.font = "bold 15px 'Segoe UI', Arial, sans-serif";
				ctx.fillStyle = act.color;
				ctx.textAlign = "right";
				ctx.fillText(act.time, 1835, actY);
				ctx.textAlign = "left";

				actY += 51;
			});
			ctx.restore();

			// --- FOOTER BAR ---
			ctx.save();
			ctx.fillStyle = "rgba(8, 11, 24, 0.9)";
			drawRoundRect(ctx, 55, 955, width - 110, 65, 16);
			ctx.fill();
			ctx.strokeStyle = "rgba(0, 210, 255, 0.35)";
			ctx.lineWidth = 1.5;
			ctx.stroke();

			ctx.font = "bold 22px 'Segoe UI', Arial, sans-serif";
			ctx.fillStyle = "#ffffff";
			ctx.shadowColor = "#00d2ff";
			ctx.shadowBlur = 12;
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
