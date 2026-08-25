const fs = require("fs-extra");
const path = require("path");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const dataPath = path.join(__dirname, "cache", "custom_data.json");

const loadData = () => {
	try {
		if (!fs.existsSync(dataPath)) {
			fs.ensureDirSync(path.dirname(dataPath));
			fs.writeFileSync(dataPath, JSON.stringify({}), "utf8");
			return {};
		}
		const content = fs.readFileSync(dataPath, "utf8");
		return content ? JSON.parse(content) : {};
	} catch (err) {
		console.error("Data Load Error:", err);
		return {};
	}
};

const saveData = (data) => {
	try {
		fs.ensureDirSync(path.dirname(dataPath));
		fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
	} catch (err) {
		console.error("Data Save Error:", err);
	}
};

let customWords = loadData();

module.exports = {
	config: {
		name: "addreply",
		aliases: ["ar", "কথা", "reply", "add", "টিচ"],
		version: "2.8",
		author: LOCKED_AUTHOR,
		countDown: 3,
		role: 0,
		description: {
			bn: "নিজের মতো কাস্টম কথা ও অটো রিপ্লাই সেট করুন"
		},
		category: "tool",
		guide: {
			bn: "addreply add <keyword> - <reply>\naddreply del <keyword>\naddreply list\naddreply clear"
		}
	},

	onStart: async function ({ api, event, args }) {
		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
		}

		const action = args[0]?.toLowerCase();

		if (action === "del") {
			const key = args.slice(1).join(" ").toLowerCase().trim();
			if (key && customWords[key]) {
				delete customWords[key];
				saveData(customWords);
				return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🗑️ 𝐑𝐄𝐏𝐋𝐘 𝐃𝐄𝐋𝐄𝐓𝐄𝐃
» 📌 𝐊𝐞𝐲𝐰𝐨𝐫𝐝: ${key}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, event.threadID, event.messageID);
			} else {
				return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐊𝐞𝐲𝐰𝐨𝐫𝐝 𝐍𝐨𝐭 𝐅𝐨𝐮𝐧𝐝!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, event.threadID, event.messageID);
			}
		}

		if (action === "clear") {
			customWords = {};
			saveData(customWords);
			return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🧹 𝐀𝐥𝐥 𝐂𝐮𝐬𝐭𝐨𝐦 𝐑𝐞𝐩𝐥𝐢𝐞𝐬 𝐂𝐥𝐞𝐚𝐫𝐞𝐝!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, event.threadID, event.messageID);
		}

		if (action === "list") {
			const keys = Object.keys(customWords);
			if (keys.length === 0) {
				return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📭 𝐍𝐨 𝐂𝐮𝐬𝐭𝐨𝐦 𝐑𝐞𝐩𝐥𝐢𝐞𝐬 𝐅𝐨𝐮𝐧𝐝!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, event.threadID, event.messageID);
			}

			let listMsg = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n📜 𝐂𝐔𝐒𝐓𝐎𝐌 𝐑𝐄𝐏𝐋𝐘 𝐋𝐈𝐒𝐓:\n\n`;
			keys.forEach((k, idx) => {
				listMsg += `${idx + 1}. ${k} ➔ ${customWords[k]}\n`;
			});
			listMsg += `\n───────────────\n» 📊 𝐓𝐨𝐭𝐚𝐥: ${keys.length}\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

			return api.sendMessage(listMsg, event.threadID, event.messageID);
		}

		let fullInput = args.join(" ");
		if (action === "add") {
			fullInput = args.slice(1).join(" ");
		}

		if (fullInput.includes("-")) {
			const splitIndex = fullInput.indexOf("-");
			const key = fullInput.substring(0, splitIndex).trim().toLowerCase();
			const reply = fullInput.substring(splitIndex + 1).trim();

			if (key && reply) {
				customWords[key] = reply;
				saveData(customWords);
				return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🗣️ 𝐀𝐔𝐓𝐎 𝐑𝐄𝐏𝐋𝐘 𝐀𝐃𝐃𝐄𝐃
» 📌 𝐊𝐞𝐲𝐰𝐨𝐫𝐝: ${key}
» 💬 𝐑𝐞𝐩𝐥𝐲: ${reply}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, event.threadID, event.messageID);
			}
		}

		return api.sendMessage(
`👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━
📌 𝐀𝐃𝐃𝐑𝐄𝐏𝐋𝐘 𝐆𝐔𝐈𝐃𝐄

» 𝐚𝐝𝐝𝐫𝐞𝐩𝐥𝐲 𝐚𝐝𝐝 <শব্দ> - <উত্তর>
➜ নতুন অটো রিপ্লাই যোগ হবে।

» 𝐚𝐝𝐝𝐫𝐞𝐩𝐥𝐲 𝐝𝐞𝐥 <শব্দ>
➜ নির্দিষ্ট অটো রিপ্লাই ডিলিট হবে।

» 𝐚𝐝𝐝𝐫𝐞𝐩𝐥𝐲 𝐥𝐢𝐬𝐭
➜ সব অটো রিপ্লাইয়ের তালিকা দেখাবে।

» 𝐚𝐝𝐝𝐫𝐞𝐩𝐥𝐲 𝐜𝐥𝐞𝐚𝐫
➜ সব অটো রিপ্লাই একসাথে ডিলিট হবে।

💡 𝐄𝐗𝐀𝐌𝐏𝐋𝐄:
addreply add hi - হ্যালো কেমন আছো?
(অথবা: add hi - হ্যালো কেমন আছো?)
━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓`, event.threadID, event.messageID);
	},

	onChat: async function ({ api, event }) {
		const msg = event.body?.toLowerCase().trim();
		if (!msg) return;

		if (customWords[msg]) {
			return api.sendMessage(customWords[msg], event.threadID, event.messageID);
		}

		for (const [key, reply] of Object.entries(customWords)) {
			if (key.length >= 2 && msg.includes(key)) {
				return api.sendMessage(reply, event.threadID, event.messageID);
			}
		}
	}
};
