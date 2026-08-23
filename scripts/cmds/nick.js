const fs = require("fs-extra");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
	config: {
		name: "nick",
		aliases: ["nickname", "setnick"],
		version: "1.0",
		author: LOCKED_AUTHOR,
		countDown: 3,
		role: 1,
		description: {
			en: "Change nickname of a user via mention, reply, or UID"
		},
		category: "group"
	},

	onStart: async function ({ api, message, event, args }) {

		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
			fs.writeFileSync(__filename, fs.readFileSync(__filename, "utf8"));
		}

		let targetID;
		let nickname = "";

		if (event.type === "message_reply") {
			targetID = event.messageReply.senderID;
			nickname = args.join(" ");
		} 
		else if (Object.keys(event.mentions).length > 0) {
			targetID = Object.keys(event.mentions)[0];
			nickname = args.join(" ").replace(event.mentions[targetID], "").trim();
		} 
		else if (args[0] && !isNaN(args[0])) {
			targetID = args[0];
			nickname = args.slice(1).join(" ");
		} 
		else {
			targetID = event.senderID;
			nickname = args.join(" ");
		}

		if (nickname.toLowerCase() === "reset") {
			nickname = "";
		}

		try {
			await api.changeNickname(nickname, event.threadID, targetID);

			const actionText = nickname ? `[ ${nickname} ]` : "𝐑𝐄𝐒𝐄𝐓 / 𝐑𝐄𝐌𝐎𝐕𝐄𝐃";

			return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ 𝐍𝐈𝐂𝐊𝐍𝐀𝐌𝐄 𝐂𝐇𝐀𝐍𝐆𝐄𝐃!
» 👤 𝐔𝐒𝐄𝐑 𝐈𝐃 : 
» 🆔 ${targetID}
» 🏷️ 𝐍𝐄𝐖 𝐍𝐈𝐂𝐊 : 
» 🦋 ${actionText}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
			);
		} catch (err) {
			return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 
» 🤩 𝐂𝐇𝐀𝐍𝐆𝐄 𝐍𝐈𝐂𝐊𝐍𝐀𝐌𝐄
» ⚠️ 𝐁𝐨𝐭 𝐡𝐚𝐬 𝐧𝐨 𝐀𝐝𝐦𝐢𝐧 
» 🍆 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
			);
		}
	}
};
