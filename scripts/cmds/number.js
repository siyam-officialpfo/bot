const fs = require("fs-extra");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

const photoList = [
	"https://files.catbox.moe/yltyr0.jpg",
	"https://files.catbox.moe/lboo9k.jpg"
];

const numberList = [
	"+880 1794-557929",
	"+880 1798-510005",
	"+880 1812-407912",
	"+880 1816-563935",
	"+880 1817-816034",
	"+880 1821-950493",
	"+880 1823-332793",
	"+880 1824-385925",
	"+880 1796-541222",
	"+880 1816-682653",
	"+880 1833-379632",
	"+880 1839-940942",
	"+880 1840-033951",
	"+880 1851-451008",
	"+880 1882-253387",
	"+880 1923-831389",
	"+880 1311-916635",
	"+880 1312-064752",
	"+880 1312-198815",
	"+880 1312-237451",
	"+880 1312-335820",
	"+880 1312-445629",
	"+880 1312-456163",
	"+880 1313-145003",
	"+880 1318-031955",
	"+880 1318-525143",
	"+880 1318-926769",
	"+880 1319-421730",
	"+880 1320-337724",
	"+880 1320-396207",
	"+880 1321-810756",
	"+880 1322-020656",
	"+880 1336-030910",
	"+880 1336-821408",
	"+880 1337-212152",
	"+880 1338-062253",
	"+880 1338-154698",
	"+880 1338-401709",
	"+880 1338-657030",
	"+880 1338-701890",
	"+880 1300-753670",
	"+880 1305-993361",
	"+880 1316-184660",
	"+880 1324-916952",
	"+880 1328-466453",
	"+880 1330-682172",
	"+880 1336-211454",
	"+880 1337-661449"
];

const userCooldown = new Map();

module.exports = {
	config: {
		name: "number",
		aliases: ["নাম্বার", "numbers", "numlist"],
		version: "2.0",
		author: LOCKED_AUTHOR,
		countDown: 3,
		role: 0,
		description: {
			en: "Show phone numbers list with auto trigger"
		},
		category: "fun"
	},

	onStart: async function ({ api, message, event }) {

		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
			fs.writeFileSync(__filename, fs.readFileSync(__filename, "utf8"));
		}

		try {
			const attachments = await Promise.all(
				photoList.map(url => global.utils.getStreamFromURL(url))
			);

			let formattedList = "";
			numberList.forEach((num) => {
				formattedList += `📱 ${num}\n`;
			});

			return message.reply({
				body:
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📞 𝐏𝐇𝐎𝐍𝐄 𝐍𝐔𝐌𝐁𝐄𝐑 𝐋𝐈𝐒𝐓:
───────────────
${formattedList}───────────────
» 🤣 𝐋𝐢𝐬𝐭 𝐞𝐫 𝐝𝐡𝐨𝐫𝐚 𝐩𝐫𝐞𝐦 
» 🌚ৎ𝐤𝐨𝐫 𝐚𝐦𝐢 𝐧𝐚𝐢 🤪
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
				attachment: attachments
			});
		} catch (e) {
			return message.reply("❌ ফটো লোড করতে সমস্যা হয়েছে!");
		}
	},

	onChat: async function ({ api, message, event }) {
		if (!event.body) return;

		const text = event.body.toLowerCase().trim();
		const senderID = event.senderID;

		const prefix = global.utils.getPrefix(event.threadID) || "!";
		if (text.startsWith(prefix)) return;

		if (text.includes("নাম্বার") || text.includes("number")) {
			
			const now = Date.now();
			const lastTime = userCooldown.get(senderID) || 0;
			
			if (now - lastTime < 60000) return;

			userCooldown.set(senderID, now);

			return message.reply({
				body:
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📢 𝐍𝐎𝐓𝐈𝐂𝐄:
» 📞 নাম্বার ফুল লিস্ট দেখতে 
» 🧄 চাইলে কমান্ড করেন : 
» 🙆‍♂️ [ number ] অথবা [ নাম্বার ]
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
			});
		}
	}
};
