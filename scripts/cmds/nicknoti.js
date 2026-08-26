const fs = require("fs-extra");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
	config: {
		name: "nicknoti",
		version: "3.0",
		author: LOCKED_AUTHOR,
		countDown: 0,
		role: 0,
		description: {
			en: "Detect nickname changes in group chat automatically"
		},
		category: "events"
	},

	onStart: async function ({ message }) {
		return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ℹ️ 𝐓𝐡𝐢𝐬 𝐢𝐬 𝐚𝐧 𝐚𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜 
» 🎁 𝐞𝐯𝐞𝐧𝐭 𝐜𝐨𝐦𝐦𝐚𝐧𝐝
» 🔔 𝐈𝐭 𝐝𝐞𝐭𝐞𝐜𝐭𝐬 𝐧𝐢𝐜𝐤𝐧𝐚𝐦𝐞 
» 🧘‍♂️ 𝐜𝐡𝐚𝐧𝐠𝐞𝐬 𝐚𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜𝐚𝐥𝐥𝐲!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
		);
	},

	onEvent: async function ({ api, message, event, usersData }) {

		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
			fs.writeFileSync(__filename, fs.readFileSync(__filename, "utf8"));
		}

		if (event.logMessageType === "log:user-nickname") {
			try {
				const authorID = event.author;
				const targetID = event.logMessageData.participant_id;
				const newNickname = event.logMessageData.nickname || "𝐑𝐄𝐒𝐄𝐓 / 𝐑𝐄𝐌𝐎𝐕𝐄𝐃";

				const authorData = await usersData.get(authorID);
				const targetData = await usersData.get(targetID);

				const authorName = authorData ? authorData.name : "Unknown User";
				const targetName = targetData ? targetData.name : "Unknown User";

				if (authorID === targetID) {
					return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔔 𝐍𝐈𝐂𝐊𝐍𝐀𝐌𝐄 𝐂𝐇𝐀𝐍𝐆𝐄 
───────────────
» 👤 𝐍𝐀𝐌𝐄 : ${authorName}
» 🆔 𝐔𝐈𝐃 : ${authorID}
» 🏷️ 𝐍𝐄𝐖 : [ ${newNickname} ]
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
					);
				} else {
					return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔔 𝐍𝐈𝐂𝐊𝐍𝐀𝐌𝐄 𝐂𝐇𝐀𝐍𝐆𝐄 
───────────────
» 👤 𝐁𝐘 : ${authorName}
» 🎯 𝐍𝐀𝐌𝐄 : ${targetName}
» 🆔 𝐔𝐈𝐃 : ${targetID}
» 🏷️ 𝐍𝐄𝐖 : [ ${newNickname} ]
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝐀𝐓𝗕𝗢𝗧`
					);
				}
			} catch (err) {
				return;
			}
		}
	}
};
