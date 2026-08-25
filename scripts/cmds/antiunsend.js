const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const cacheDir = path.join(__dirname, "cache", "unsend_media");
const settingsPath = path.join(__dirname, "cache", "unsend_settings.json");

global.unsendMemoryMap = global.unsendMemoryMap || new Map();
global.unsendUserCooldown = global.unsendUserCooldown || new Map();
global.unsendAdminRecovered = global.unsendAdminRecovered || new Map();

const loadSettings = () => {
	try {
		if (!fs.existsSync(settingsPath)) {
			fs.ensureDirSync(path.dirname(settingsPath));
			fs.writeFileSync(settingsPath, JSON.stringify({}), "utf8");
			return {};
		}
		const content = fs.readFileSync(settingsPath, "utf8");
		return content ? JSON.parse(content) : {};
	} catch (err) {
		return {};
	}
};

const saveSettings = (data) => {
	try {
		fs.ensureDirSync(path.dirname(settingsPath));
		fs.writeFileSync(settingsPath, JSON.stringify(data, null, 2), "utf8");
	} catch (err) {}
};

let settings = loadSettings();

const isUserAdmin = async (api, event, senderID) => {
	try {
		const targetID = senderID || event.senderID;
		if (global.config) {
			if (Array.isArray(global.config.ADMINBOT) && global.config.ADMINBOT.includes(targetID)) return true;
			if (Array.isArray(global.config.NDH) && global.config.NDH.includes(targetID)) return true;
		}
		const threadInfo = await api.getThreadInfo(event.threadID);
		const adminIDs = (threadInfo.adminIDs || []).map(i => i.id || i);
		if (adminIDs.includes(targetID)) return true;
	} catch (e) {}
	return false;
};

module.exports = {
	config: {
		name: "antiunsend",
		aliases: ["unsend", "অ্যান্টিআনসেন্ড", "resend"],
		version: "4.0",
		author: LOCKED_AUTHOR,
		countDown: 2,
		role: 0,
		description: {
			bn: "এডভান্সড অ্যান্টি-আনসেন্ড সিস্টেম উইথ কুলডাউন ও এডমিন রিস্টার্ট লজিক"
		},
		category: "utility",
		guide: {
			bn: "antiunsend <on|off>\nantiunsend restart / রিস্টার্ট\nantiunsend status"
		}
	},

	onStart: async function ({ api, event, args }) {
		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
		}

		const threadID = event.threadID;
		if (settings[threadID] === undefined) {
			settings[threadID] = false;
			saveSettings(settings);
		}

		const option = args[0]?.toLowerCase();

		if (option === "on") {
			const isAdmin = await isUserAdmin(api, event, event.senderID);
			if (!isAdmin) {
				return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐏𝐄𝐑𝐌𝐈𝐒𝐒𝐈𝐎𝐍 𝐃𝐄𝐍𝐈𝐄𝐃!
» ⚠️ 𝐎𝐧𝐥𝐲 𝐀𝐝𝐦𝐢𝐧𝐬 𝐜𝐚𝐧 𝐭𝐮𝐫𝐧 𝐎𝐍 𝐀𝐧𝐭𝐢-𝐔𝐧𝐬𝐞𝐧𝐝.
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, event.messageID);
			}

			settings[threadID] = true;
			saveSettings(settings);
			return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🛡️ 𝐀𝐍𝐓𝐈-𝐔𝐍𝐒𝐄𝐍𝐃 𝐀𝐂𝐓𝐈𝐕𝐀𝐓𝐄𝐃!
» 📌 𝐒𝐭𝐚𝐭𝐮𝐬: Enabled ✅
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, event.messageID);
		}

		if (option === "off") {
			settings[threadID] = false;
			saveSettings(settings);
			return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🛡️ 𝐀𝐍𝐓𝐈-𝐔𝐍𝐒𝐄𝐍𝐃 𝐃𝐄𝐀𝐂𝐓𝐈𝐕𝐀𝐓𝐄𝐃!
» 📌 𝐒𝐭𝐚𝐭𝐮𝐬: Disabled ❌
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, event.messageID);
		}

		if (option === "restart" || option === "রিস্টার্ট") {
			const isAdmin = await isUserAdmin(api, event, event.senderID);
			if (!isAdmin) {
				return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐏𝐄𝐑𝐌𝐈𝐒𝐒𝐈𝐎𝐍 𝐃𝐄𝐍𝐈𝐄𝐃!
» ⚠️ 𝐎𝐧𝐥𝐲 𝐀𝐝𝐦𝐢𝐧𝐬 𝐜𝐚𝐧 𝐮𝐬𝐞 𝐫𝐞𝐬𝐭𝐚𝐫𝐭.
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, event.messageID);
			}

			global.unsendAdminRecovered.delete(`${threadID}_${event.senderID}`);
			return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔄 𝐀𝐃𝐌𝐈𝐍 𝐑𝐄𝐂𝐎𝐕𝐄𝐑𝐘 𝐑𝐄𝐒𝐄𝐓!
» 📌 𝐘𝐨𝐮𝐫 𝐮𝐧𝐬𝐞𝐧𝐝 𝐫𝐞𝐜𝐨𝐯𝐞𝐫𝐲 𝐥𝐢𝐦𝐢𝐭 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐫𝐞𝐬𝐞𝐭.
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, event.messageID);
		}

		if (option === "status" || option === "info") {
			const statusStr = settings[threadID] ? "ON ✅" : "OFF ❌";
			return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
🛡️ 𝐀𝐍𝐓𝐈-𝐔𝐍𝐒𝐄𝐍𝐃 𝐒𝐓𝐀𝐓𝐔𝐒:

» 📌 𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐒𝐭𝐚𝐭𝐮𝐬: ${statusStr}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, event.messageID);
		}

		return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
📌 𝐀𝐍𝐓𝐈-𝐔𝐍𝐒𝐄𝐍𝐃 𝐆𝐔𝐈𝐃𝐄:

» antiunsend on (Admin Only)
» antiunsend off (Anyone)
» antiunsend restart / রিস্টার্ট (Admin Only)
» antiunsend status
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, event.messageID);
	},

	onChat: async function ({ api, event, Users }) {
		const threadID = event.threadID;

		const msgText = event.body?.toLowerCase().trim();
		if (msgText === "restart" || msgText === "রিস্টার্ট") {
			const isAdmin = await isUserAdmin(api, event, event.senderID);
			if (isAdmin) {
				global.unsendAdminRecovered.delete(`${threadID}_${event.senderID}`);
				return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔄 𝐀𝐃𝐌𝐈𝐍 𝐑𝐄𝐂𝐎𝐕𝐄𝐑𝐘 𝐑𝐄𝐒𝐄𝐓!
» 📌 𝐘𝐨𝐮𝐫 𝐮𝐧𝐬𝐞𝐧𝐝 𝐫𝐞𝐜𝐨𝐯𝐞𝐫𝐲 𝐥𝐢𝐦𝐢𝐭 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐫𝐞𝐬𝐞𝐭.
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, event.messageID);
			}
		}

		if (settings[threadID] !== true) return;

		if (event.type === "message_unsend") {
			const savedMsg = global.unsendMemoryMap.get(event.messageID);
			if (!savedMsg) return;

			const senderID = savedMsg.senderID;
			const isAdmin = await isUserAdmin(api, event, senderID);

			if (isAdmin) {
				const adminKey = `${threadID}_${senderID}`;
				if (global.unsendAdminRecovered.get(adminKey)) {
					return;
				}
				global.unsendAdminRecovered.set(adminKey, true);
			} else {
				const userKey = `${threadID}_${senderID}`;
				const lastTime = global.unsendUserCooldown.get(userKey) || 0;
				const now = Date.now();
				if (now - lastTime < 3 * 60 * 1000) {
					return;
				}
				global.unsendUserCooldown.set(userKey, now);
			}

			let senderName = "User";
			try {
				if (Users && typeof Users.getNameInBand === "function") {
					senderName = await Users.getNameInBand(senderID);
				} else if (Users && typeof Users.getName === "function") {
					senderName = await Users.getName(senderID);
				}
			} catch (e) {}

			let resendBody = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n⚠️ 𝐔𝐍𝐒𝐄𝐍𝐓 𝐌𝐄𝐒𝐒𝐀𝐆𝐄 𝐃𝐄𝐓𝐄𝐂𝐓𝐄𝐃!\n\n» 👤 𝐒𝐞𝐧𝐝𝐞𝐫: ${senderName}\n`;

			if (savedMsg.body) {
				resendBody += `» 💬 𝐌𝐞𝐬𝐬𝐚𝐠𝐞: ${savedMsg.body}\n`;
			} else if (savedMsg.attachmentPaths && savedMsg.attachmentPaths.length > 0) {
				resendBody += `» 📁 𝐀𝐭𝐭𝐚𝐜𝐡𝐦𝐞𝐧𝐭: [${savedMsg.attachmentPaths.length} File(s)]\n`;
			}
			resendBody += `───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

			let attachmentStreams = [];
			if (savedMsg.attachmentPaths && savedMsg.attachmentPaths.length > 0) {
				for (const filePath of savedMsg.attachmentPaths) {
					if (fs.existsSync(filePath)) {
						attachmentStreams.push(fs.createReadStream(filePath));
					}
				}
			}

			await api.sendMessage({
				body: resendBody,
				attachment: attachmentStreams.length > 0 ? attachmentStreams : undefined
			}, threadID);

			global.unsendMemoryMap.delete(event.messageID);
			return;
		}

		if (event.type === "message" || event.type === "message_reply") {
			fs.ensureDirSync(cacheDir);

			let cachedAttachmentPaths = [];

			if (event.attachments && event.attachments.length > 0) {
				for (let i = 0; i < event.attachments.length; i++) {
					const att = event.attachments[i];
					if (att.url) {
						let ext = "png";
						if (att.type === "photo") ext = "jpg";
						else if (att.type === "video") ext = "mp4";
						else if (att.type === "audio") ext = "mp3";
						else if (att.type === "animated_image") ext = "gif";

						const filePath = path.join(cacheDir, `${event.messageID}_${i}.${ext}`);
						try {
							const response = await axios({
								method: "GET",
								url: att.url,
								responseType: "stream"
							});
							const writer = fs.createWriteStream(filePath);
							response.data.pipe(writer);

							await new Promise((resolve, reject) => {
								writer.on("finish", resolve);
								writer.on("error", reject);
							});
							cachedAttachmentPaths.push(filePath);
						} catch (err) {}
					}
				}
			}

			global.unsendMemoryMap.set(event.messageID, {
				body: event.body || "",
				senderID: event.senderID,
				attachmentPaths: cachedAttachmentPaths,
				timestamp: Date.now()
			});

			if (global.unsendMemoryMap.size > 100) {
				const oldestKey = global.unsendMemoryMap.keys().next().value;
				const oldData = global.unsendMemoryMap.get(oldestKey);
				if (oldData && oldData.attachmentPaths) {
					oldData.attachmentPaths.forEach(p => {
						try { fs.unlinkSync(p); } catch (e) {}
					});
				}
				global.unsendMemoryMap.delete(oldestKey);
			}
		}
	}
};
