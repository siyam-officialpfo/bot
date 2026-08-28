const fs = require("fs-extra");
const path = require("path");

const LOCKED_AUTHOR = "☘፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const dataPath = path.join(__dirname, "realblock.json");

let blockList = [];
let lastListMsg = {};

function load() {
	try {
		if (fs.existsSync(dataPath)) {
			const data = fs.readJsonSync(dataPath);
			blockList = Array.isArray(data) ? data : [];
		} else {
			blockList = [];
			fs.writeJsonSync(dataPath, blockList, { spaces: 2 });
		}
	} catch (e) {
		blockList = [];
	}
}

function save() {
	try {
		fs.writeJsonSync(dataPath, blockList, { spaces: 2 });
	} catch (e) {}
}

load();

function realBlock(api, uid, status) {
	return new Promise((resolve) => {
		if (typeof api.changeBlockedStatus !== "function") {
			return resolve({ error: "API not supported" });
		}
		api.changeBlockedStatus(uid, status, (err) => {
			if (err) return resolve({ error: err });
			resolve({ success: true });
		});
	});
}

module.exports = {
	config: {
		name: "block",
		version: "3.1",
		author: LOCKED_AUTHOR,
		countDown: 3,
		role: 2,
		description: {
			en: "Real Facebook block/unblock"
		},
		category: "admin"
	},

	onStart: async function ({ api, event, args, message, usersData }) {
		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
		}

		load();

		const botID = api.getCurrentUserID();
		const senderID = event.senderID;
		const threadID = event.threadID;

		if (args[0]?.toLowerCase() === "list") {
			if (blockList.length === 0) {
				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📭 𝐁𝐋𝐎𝐂𝐊 𝐋𝐈𝐒𝐓 𝐄𝐌𝐏𝐓𝐘
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);
			}

			let msg = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🚫 𝐓𝐎𝐓𝐀𝐋 𝐁𝐋𝐎𝐂𝐊𝐄𝐃 : ${blockList.length}
───────────────\n`;

			for (let i = 0; i < blockList.length; i++) {
				const uid = blockList[i];
				let name = "Unknown";
				try {
					const u = await usersData.get(uid);
					name = u?.name || "Unknown";
				} catch (e) {}
				msg += `» ${i + 1}. ${name}\n   🆔 ${uid}\n`;
			}

			msg += `───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

			const sent = await message.reply(msg);
			if (sent && sent.messageID) {
				lastListMsg[threadID] = {
					messageID: sent.messageID,
					list: [...blockList]
				};
			}
			return;
		}

		const isUnblock = args[0]?.toLowerCase() === "un" || args[0]?.toLowerCase() === "unblock";

		let targetID = null;

		if (event.type === "message_reply" && event.messageReply) {
			targetID = event.messageReply.senderID;
		} else if (event.mentions && Object.keys(event.mentions).length > 0) {
			targetID = Object.keys(event.mentions)[0];
		} else {
			const possibleUID = isUnblock ? args[1] : args[0];
			if (possibleUID && /^\d+$/.test(possibleUID)) {
				targetID = possibleUID;
			}
		}

		if (!targetID) {
			return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝐖𝐑𝐎𝐍𝐆 𝐔𝐒𝐀𝐆𝐄
───────────────
» 𝐑𝐞𝐩𝐥𝐲 / 𝐌𝐞𝐧𝐭𝐢𝐨𝐧 / 𝐔𝐈𝐃
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
			);
		}

		if (targetID === senderID) {
			return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐂𝐀𝐍𝐍𝐎𝐓 𝐁𝐋𝐎𝐂𝐊 𝐘𝐎𝐔𝐑𝐒𝐄𝐋𝐅
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
			);
		}

		if (targetID === botID) {
			return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐂𝐀𝐍𝐍𝐎𝐓 𝐁𝐋𝐎𝐂𝐊 
» 🦋 𝐓𝐇𝐄 𝐁𝐎𝐓
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
			);
		}

		let targetName = "Unknown";
		try {
			const user = await usersData.get(targetID);
			targetName = user?.name || "Unknown";
		} catch (e) {}

		if (isUnblock) {
			const result = await realBlock(api, targetID, false);

			if (result.error) {
				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐔𝐍𝐁𝐋𝐎𝐂𝐊 𝐅𝐀𝐈𝐋𝐄𝐃
───────────────
» 👤 𝐍𝐀𝐌𝐄 : ${targetName}
» 🆔 𝐔𝐈𝐃 : ${targetID}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);
			}

			blockList = blockList.filter(id => id !== targetID);
			save();

			return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ 𝐔𝐍𝐁𝐋𝐎𝐂𝐊𝐄𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒
───────────────
» 👤 𝐍𝐀𝐌𝐄 : ${targetName}
» 🆔 𝐔𝐈𝐃 : ${targetID}
» 🚫 𝐓𝐎𝐓𝐀𝐋 𝐁𝐋𝐎𝐂𝐊𝐄𝐃 : ${blockList.length}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
			);
		}

		if (blockList.includes(targetID)) {
			return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝐀𝐋𝐑𝐄𝐀𝐃𝐘 𝐁𝐋𝐎𝐂𝐊𝐄𝐃
───────────────
» 👤 𝐍𝐀𝐌𝐄 : ${targetName}
» 🆔 𝐔𝐈𝐃 : ${targetID}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
			);
		}

		const result = await realBlock(api, targetID, true);

		if (result.error) {
			return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐁𝐋𝐎𝐂𝐊 𝐅𝐀𝐈𝐋𝐄𝐃
───────────────
» 👤 𝐍𝐀𝐌𝐄 : ${targetName}
» 🆔 𝐔𝐈𝐃 : ${targetID}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
			);
		}

		blockList.push(targetID);
		save();

		return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ 𝐁𝐋𝐎𝐂𝐊𝐄𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒
───────────────
» 👤 𝐍𝐀𝐌𝐄 : ${targetName}
» 🆔 𝐔𝐈𝐃 : ${targetID}
» 🚫 𝐓𝐎𝐓𝐀𝐋 𝐁𝐋𝐎𝐂𝐊𝐄𝐃 : ${blockList.length}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
		);
	},

	onChat: async function ({ api, event, message, usersData }) {
		if (!event || event.type !== "message_reply") return;

		const threadID = event.threadID;
		const body = (event.body || "").trim();

		if (!/^\d+$/.test(body)) return;

		const stored = lastListMsg[threadID];
		if (!stored || event.messageReply.messageID !== stored.messageID) return;

		const index = parseInt(body) - 1;
		if (index < 0 || index >= stored.list.length) return;

		const targetID = stored.list[index];

		let targetName = "Unknown";
		try {
			const user = await usersData.get(targetID);
			targetName = user?.name || "Unknown";
		} catch (e) {}

		const result = await realBlock(api, targetID, false);

		if (result.error) {
			return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐔𝐍𝐁𝐋𝐎𝐂𝐊 𝐅𝐀𝐈𝐋𝐄𝐃
───────────────
» 👤 𝐍𝐀𝐌𝐄 : ${targetName}
» 🆔 𝐔𝐈𝐃 : ${targetID}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
			);
		}

		blockList = blockList.filter(id => id !== targetID);
		save();
		delete lastListMsg[threadID];

		return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ 𝐔𝐍𝐁𝐋𝐎𝐂𝐊𝐄𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒
───────────────
» 👤 𝐍𝐀𝐌𝐄 : ${targetName}
» 🆔 𝐔𝐈𝐃 : ${targetID}
» 🚫 𝐓𝐎𝐓𝐀𝐋 𝐁𝐋𝐎𝐂𝐊𝐄𝐃 : ${blockList.length}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
		);
	}
};
