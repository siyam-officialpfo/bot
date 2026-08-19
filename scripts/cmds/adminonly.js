const fs = require("fs-extra");
const moment = require("moment-timezone");
const { config } = global.GoatBot;
const { client } = global;

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
	config: {
		name: "adminonly",
		aliases: ["adonly", "onlyad", "onlyadmin", "vip"],
		version: "3.2",
		author: LOCKED_AUTHOR,
		countDown: 5,
		role: 1,
		description: {
			en: "Toggle admin-only mode"
		},
		category: "owner"
	},

	onStart: function ({ args, message, event }) {

		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
			fs.writeFileSync(__filename, fs.readFileSync(__filename, "utf8"));
		}

		let isSetNoti = false;
		let value;
		let indexGetVal = 0;

		// vip on / vip off সাপোর্ট করার জন্য চেক
		const body = event.body ? event.body.toLowerCase().trim() : "";
		if (body == "vip on") {
			args[0] = "on";
		} else if (body == "vip off") {
			args[0] = "off";
		}

		if (args[0] == "noti") {
			isSetNoti = true;
			indexGetVal = 1;
		}

		if (args[indexGetVal] == "on") value = true;
		else if (args[indexGetVal] == "off") value = false;
		else return message.SyntaxError();

		// 🔔 নোটিফিকেশন মোড (বাংলা মেসেজ)
		if (isSetNoti) {
			config.hideNotiMessage.adminOnly = !value;

			if (value) {
				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔔 𝐍𝐎𝐓𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍 𝐎𝐍
» ⚠️ 𝐍𝐎𝐍-𝐀𝐃𝐌𝐈𝐍 𝐖𝐈𝐋𝐋 𝐒𝐄𝐄 
» 🐸 𝐖𝐀𝐑𝐍𝐈𝐍𝐆 𝐌𝐄𝐒𝐒𝐀𝐆𝐄
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);
			} else {
				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔕 𝐍𝐎𝐓𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍 𝐎𝐅𝐅
» 🤫 𝐍𝐎𝐍-𝐀𝐃𝐌𝐈𝐍 𝐖𝐈𝐋𝐋 𝐍𝐎𝐓 
» ☠️ 𝐒𝐄𝐄 𝐀𝐍𝐘 𝐌𝐄𝐒𝐒𝐀𝐆𝐄
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);
			}
		}

		// 🔐 এডমিন মোড (বাংলা মেসেজ)
		config.adminOnly.enable = value;
		fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));

		if (value) {
			return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔐 𝐀𝐃𝐌𝐈𝐍 𝐎𝐍𝐋𝐘  𝐎𝐍
» 🚫 এখন শুধু বস সিয়াম বট
» 🤧  ব্যবহার করতে পারবে
» 👑 সিয়াম বস ছাড়া কেউ 
» 😮‍💨 বট ব্যবহার করতে পারবে না
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
			);
		} else {
			return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔓 𝐀𝐃𝐌𝐈𝐍 𝐎𝐍𝐋𝐘 𝐌𝐎𝐃𝐄 𝐎𝐅𝐅
» ✅ এখন সবাই বট 
» 🌚 ব্যবহার করতে পারবে
» 🎉 সবাই এনজয় করো
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
			);
		}
	}
};
