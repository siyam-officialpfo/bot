const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

function cleanText(text) {
	if (!text) return "NEW MEMBER";
	return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x00-\x7F]/g, "");
}

module.exports = {
	config: {
		name: "welcome",
		version: "1.0.0",
		author: LOCKED_AUTHOR,
		countDown: 0,
		role: 0,
		description: {
			en: "Dynamic Welcome Card with Random Backgrounds"
		},
		category: "events",
		eventType: ["log:subscribe"]
	},

	onStart: async function ({ message }) {
		return message.reply("⚡ Dynamic Welcome Event is active! It will automatically trigger when someone joins the group.");
	},

	handleEvent: async function ({ api, event, threadsData, usersData }) {
		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
			try { fs.writeFileSync(__filename, fs.readFileSync(__filename, "utf8")); } catch (e) {}
		}

		if (event.logMessageType !== "log:subscribe") return;

		try {
			const threadInfo = await threadsData.get(event.threadID) || {};
			const groupName = cleanText(threadInfo.threadName || "Our Awesome Group").toUpperCase();
			const memberCount = threadInfo.participantIDs ? threadInfo.participantIDs.length : "N/A";

			const addedParticipants = event.logMessageData.addedParticipants;
			if (!addedParticipants || addedParticipants.length === 0) return;

			for (let participant of addedParticipants) {
				const userID = participant.userFbId;
				const rawName = participant.fullName || "New Member";
				const userName = cleanText(rawName).toUpperCase();
				const avatarLink = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

				const width = 900;
				const height = 400;
				const canvas = createCanvas(width, height);
				const ctx = canvas.getContext("2d");

				try {
					const randomBgUrl = `https://picsum.photos/${width}/${height}?random=${Date.now()}`;
					const bgResponse = await axios.get(randomBgUrl, { responseType: 'arraybuffer' });
					const bgImage = await loadImage(Buffer.from(bgResponse.data, 'binary'));
					ctx.drawImage(bgImage, 0, 0, width, height);
				} catch (e) {
					const colors = ["#1a2a6c", "#b21f1f", "#fdbb2d"];
					const grad = ctx.createLinearGradient(0, 0, width, height);
					grad.addColorStop(0, colors[Math.floor(Math.random() * colors.length)]);
					grad.addColorStop(1, "#000000");
					ctx.fillStyle = grad;
					ctx.fillRect(0, 0, width, height);
				}

				ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
				ctx.fillRect(0, 0, width, height);

				ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
				ctx.lineWidth = 4;
				ctx.strokeRect(15, 15, width - 30, height - 30);
				
				ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
				ctx.lineWidth = 1;
				ctx.strokeRect(25, 25, width - 50, height - 50);

				const avatarSize = 220;
				const avatarX = 50;
				const avatarY = height / 2 - avatarSize / 2;

				try {
					const avatarImg = await loadImage(avatarLink);
					ctx.save();
					ctx.beginPath();
					ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
					ctx.closePath();
					ctx.lineWidth = 10;
					ctx.strokeStyle = "#ff007f"; 
					ctx.stroke();
					ctx.clip();
					ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
					ctx.restore();
				} catch (e) {
					ctx.fillStyle = "#ffffff";
					ctx.beginPath();
					ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
					ctx.fill();
				}

				const textStartX = 320;
				
				ctx.fillStyle = "#00ffcc";
				ctx.shadowColor = "#00ffcc";
				ctx.shadowBlur = 10;
				ctx.font = "bold italic 36px sans-serif";
				ctx.fillText("WELCOME TO", textStartX, 110);
				ctx.shadowBlur = 0;

				ctx.fillStyle = "#ffffff";
				ctx.font = "bold 45px sans-serif";
				ctx.fillText(groupName.length > 20 ? groupName.substring(0, 20) + "..." : groupName, textStartX, 165);

				ctx.fillStyle = "rgba(255, 0, 127, 0.2)";
				ctx.fillRect(textStartX, 200, 520, 60);

				ctx.fillStyle = "#ff007f";
				ctx.shadowColor = "#ff007f";
				ctx.shadowBlur = 15;
				ctx.font = "bold 35px sans-serif";
				ctx.fillText(`👤 ${userName.length > 20 ? userName.substring(0, 20) + "..." : userName}`, textStartX + 15, 242);
				ctx.shadowBlur = 0;

				ctx.fillStyle = "#ffee00";
				ctx.font = "bold 24px sans-serif";
				ctx.fillText(`✨ YOU ARE MEMBER #${memberCount} ✨`, textStartX, 310);

				ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
				ctx.font = "bold 14px sans-serif";
				ctx.textAlign = "right";
				ctx.fillText("DEV: SIYAM-HASAN", width - 35, height - 35);

				const cachePath = path.join(__dirname, "cache", `welcome_${userID}_${Date.now()}.png`);
				fs.ensureDirSync(path.join(__dirname, "cache"));
				const buffer = canvas.toBuffer("image/png");
				fs.writeFileSync(cachePath, buffer);

				const welcomeMsg = `হ্যালো ${rawName}, ${threadInfo.threadName || "আমাদের গ্রুপে"}-এ স্বাগতম! 🎊\nআশা করি গ্রুপের নিয়মকানুন মেনে সবার সাথে ভালো সময় কাটাবেন।`;

				api.sendMessage(
					{
						body: welcomeMsg,
						attachment: fs.createReadStream(cachePath)
					},
					event.threadID,
					() => fs.unlinkSync(cachePath)
				);
			}
		} catch (err) {}
	}
};                adderAvatar,
                userName,
                memberCount,
                threadName,
                adderName
            );
            const tempPath = path.join(
                tempDir,
                `welcome_${Date.now()}.png`
            );
            fs.writeFileSync(tempPath, imageBuffer);
            await message.reply({
                body: `🌸 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 🌸\n━━━━━━━━━━━━\n🌷 𝐍𝐚𝐦𝐞: ${userName}\n🏷️ 𝐆𝐫𝐨𝐮𝐩: ${threadName}\n🔢 𝐌𝐞𝐦𝐛𝐞𝐫 #${memberCount}\n👤 𝐀𝐝𝐝𝐞𝐝 𝐛𝐲: ${adderName}\n━━━━━━━━━━━━\n𝐄𝐧𝐣𝐨𝐲 𝐲𝐨𝐮𝐫 𝐬𝐭𝐚𝐲! 😊`,
                attachment: fs.createReadStream(tempPath)
            });
            setTimeout(() => {
                if (fs.existsSync(tempPath)) {
                    fs.unlinkSync(tempPath);
                }
            }, 10000);

        } catch (error) {
            console.error("[Welcome error]:", error);
            const addedUser = event.logMessageData.addedParticipants[0];
            await message.send({
                body: `🌸 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 ${addedUser.fullName}! 🌸\n━━━━━━━━━━━━\n🌷 𝐓𝐨 𝐨𝐮𝐫 𝐠𝐫𝐨𝐮𝐩 𝐟𝐚𝐦𝐢𝐥𝐲!\n🌟 𝐖𝐞'𝐫𝐞 𝐞𝐱𝐜𝐢𝐭𝐞𝐝 𝐭𝐨 𝐡𝐚𝐯𝐞 𝐲𝐨𝐮!\n🎊 𝐏𝐥𝐞𝐚𝐬𝐞 𝐢𝐧𝐭𝐫𝐨𝐝𝐮𝐜𝐞 𝐲𝐨𝐮𝐫𝐬𝐞𝐥𝐟!\n━━━━━━━━━━━━\n𝐇𝐚𝐯𝐞 𝐟𝐮𝐧! 😊`
            });
        }
    }
};
