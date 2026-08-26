const fs = require("fs-extra");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
	config: {
		name: "nicknoti",
		version: "1.0.0",
		role: 0,
		author: LOCKED_AUTHOR,
		description: "Notify when someone changes or resets a nickname",
		category: "events",
		countDown: 0
	},

	onEvent: async function ({ api, event, message }) {
		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
			try {
				fs.writeFileSync(__filename, fs.readFileSync(__filename, "utf8"));
			} catch (e) {}
		}

		if (event.logMessageType === "log:user-nickname") {
			const { threadID, logMessageData } = event;
			const targetID = logMessageData.participant_id;
			const newNickname = logMessageData.nickname;

			try {
				const userInfo = await api.getUserInfo(targetID);
				const realName = userInfo[targetID]?.name || "Unknown User";
				const displayNick = newNickname && newNickname.trim() !== "" ? `[ ${newNickname} ]` : "𝐑𝐄𝐒𝐄𝐓 / 𝐑𝐄𝐌𝐎𝐕𝐄𝐃";

				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔔 𝐍𝐈𝐂𝐊𝐍𝐀𝐌𝐄 𝐂𝐇𝐀𝐍𝐆𝐄𝐃!
» 👤 𝐔𝐒𝐄𝐑 𝐍𝐀𝐌𝐄 : ${realName}
» 🆔 𝐔𝐒𝐄𝐑 𝐔𝐈𝐃 : ${targetID}
» 🏷️ 𝐍𝐄𝐖 𝐍𝐈𝐂𝐊 : ${displayNick}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);
			} catch (err) {
				return;
			}
		}
	}
};
