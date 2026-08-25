const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

const isUserAdmin = async (api, event, senderID) => {
	try {
		const targetID = String(senderID || event.senderID);
		if (global.config) {
			if (Array.isArray(global.config.ADMINBOT) && global.config.ADMINBOT.map(String).includes(targetID)) return true;
			if (Array.isArray(global.config.NDH) && global.config.NDH.map(String).includes(targetID)) return true;
		}
		const threadInfo = await api.getThreadInfo(event.threadID);
		const adminIDs = (threadInfo.adminIDs || []).map(i => String(i.id || i));
		if (adminIDs.includes(targetID)) return true;
	} catch (e) {}
	return false;
};

module.exports = {
	config: {
		name: "allout",
		aliases: ["leaveall", "শালা_লিভনে"],
		version: "1.0",
		author: LOCKED_AUTHOR,
		countDown: 5,
		role: 1,
		description: {
			bn: "চলতি গ্রুপটি বাদে বট যুক্ত থাকা বাকি সব গ্রুপ থেকে লিভ নেবে"
		},
		category: "admin",
		guide: {
			bn: "allout"
		}
	},

	onStart: async function ({ api, event }) {
		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
		}

		const currentThreadID = String(event.threadID);

		const isAdmin = await isUserAdmin(api, event, event.senderID);
		if (!isAdmin) {
			return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐏𝐄𝐑𝐌𝐈𝐒𝐒𝐈𝐎𝐍 𝐃𝐄𝐍𝐈𝐄𝐃!
» ⚠️ 𝐎𝐧𝐥𝐲 𝐀𝐝𝐦𝐢𝐧𝐬 𝐜𝐚𝐧 𝐮𝐬𝐞 
» 🚪 𝐀𝐥𝐥-𝐎𝐮𝐭 𝐂𝐨𝐦𝐦𝐚𝐧𝐝.
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, currentThreadID, event.messageID);
		}

		const initMsg = await api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚙️ 𝐏𝐑𝐎𝐂𝐄𝐒𝐒𝐈𝐍𝐆...
» ⏳ 𝐋𝐞𝐚𝐯𝐢𝐧𝐠 𝐚𝐥𝐥 𝐨𝐭𝐡𝐞𝐫 𝐠𝐫𝐨𝐮𝐩𝐬, 
» 📌 𝐩𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, currentThreadID);

		try {
			const threadList = await api.getThreadList(100, null, ["INBOX"]);
			
			const targetGroupIDs = threadList
				.filter(thread => thread.isGroup && String(thread.threadID) !== currentThreadID)
				.map(thread => String(thread.threadID));

			let successCount = 0;
			let failCount = 0;

			for (const id of targetGroupIDs) {
				try {
					await api.removeUserFromGroup(api.getCurrentUserID(), id);
					successCount++;
					await new Promise(resolve => setTimeout(resolve, 1000));
				} catch (err) {
					failCount++;
				}
			}

			return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🚀 𝐀𝐋𝐋-𝐎𝐔𝐓 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄𝐃!
───────────────
» ✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐋𝐞𝐟𝐭: ${successCount} Group(s)
» ❌ 𝐅𝐚𝐢𝐥𝐞𝐝: ${failCount} Group(s)
» 📌 𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐆𝐫𝐨𝐮𝐩: Saved Safe 🛡️
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, currentThreadID, event.messageID);

		} catch (error) {
			return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐄𝐑𝐑𝐎𝐑!
» ⚠️ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐟𝐞𝐭𝐜𝐡 𝐠𝐫𝐨𝐮𝐩 𝐥𝐢𝐬𝐭.
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, currentThreadID, event.messageID);
		}
	}
};
