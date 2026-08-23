const fs = require("fs-extra");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
	config: {
		name: "fbinfo",
		aliases: ["fb", "userinfo"],
		version: "1.2",
		author: LOCKED_AUTHOR,
		role: 0,
		shortDescription: "Facebook user info",
		longDescription: "Get Facebook user info safely",
		category: "info",
		guide: "{p}fbinfo @mention | uid"
	},

	onStart: async function ({ api, event, args, message }) {
		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
			fs.writeFileSync(__filename, fs.readFileSync(__filename, "utf8"));
		}

		try {
			let uid = event.senderID;

			if (Object.keys(event.mentions || {}).length > 0) {
				uid = Object.keys(event.mentions)[0];
			}
			else if (args[0] && !isNaN(args[0])) {
				uid = args[0];
			}

			const data = await api.getUserInfo(uid);
			const user = data[uid];

			if (!user) {
				return message.reply("❌ User info not found");
			}

			const gender =
				user.gender == 1 ? "Female" :
				user.gender == 2 ? "Male" :
				"Unknown";

			return message.reply(
`📘 𝗜𝗡𝗙𝗢

╭───────────────⭓
│ 👤 𝗡𝗮𝗺𝗲
│ ${user.name || "Unknown"}
│ 🆔 𝗨𝗜𝗗
│ ${uid}
│ 🌐 𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲
│ ${user.vanity || "Not set"}
│ 🚻 𝗚𝗲𝗻𝗱𝗲𝗿
│ ${gender}
│ 🔗 𝗣𝗿𝗼𝗳𝗶𝗹𝗲
│ https://facebook.com/${uid}

╰───────────────⭓
╭─❖
│ 👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
│ ━━━━━━━━━━━━━━━
🦋 ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧
╰──────────────⭓`
			);

		} catch (err) {
			console.log(err);
			return message.reply(
				"⚠️ Error: fbinfo command failed"
			);
		}
	}
};
