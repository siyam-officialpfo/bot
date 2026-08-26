const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const cacheDir = path.join(__dirname, "cache");
const cacheFile = path.join(cacheDir, "tempmail_accounts.json");

const loadAccounts = () => {
	try {
		if (!fs.existsSync(cacheFile)) {
			fs.ensureDirSync(cacheDir);
			fs.writeFileSync(cacheFile, JSON.stringify({}), "utf8");
			return {};
		}
		const content = fs.readFileSync(cacheFile, "utf8");
		return content ? JSON.parse(content) : {};
	} catch (e) {
		return {};
	}
};

const saveAccounts = (data) => {
	try {
		fs.ensureDirSync(cacheDir);
		fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2), "utf8");
	} catch (e) {}
};

let emailAccounts = loadAccounts();
const API = "https://api.mail.tm";

module.exports = {
	config: {
		name: "tempmail",
		aliases: ["tm", "mail", "জিমেইল"],
		version: "4.5",
		author: LOCKED_AUTHOR,
		countDown: 3,
		role: 0,
		usePrefix: true,
		description: {
			bn: "টোকেন ছাড়া ফেক ইমেইল তৈরি ও ইনবক্স দেখার অ্যাডভান্সড সিস্টেম"
		},
		category: "utility",
		guide: {
			bn: "tempmail ➔ নতুন ইমেইল তৈরি করতে\ntempmail inbox <email> ➔ ইমেইলের ইনবক্স মেসেজ দেখতে"
		}
	},

	onStart: async function ({ api, event, args }) {
		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
		}

		const threadID = event.threadID;
		const messageID = event.messageID;
		const subCommand = args[0]?.toLowerCase();

		if (subCommand === "inbox" || subCommand === "inb") {
			const email = args[1]?.toLowerCase()?.trim();

			if (!email) {
				return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐌𝐈𝐒𝐒𝐈𝐍𝐆 𝐄𝐌𝐀𝐈𝐋!
» ⚠️ অনুগ্রহ করে আপনার
» 🧙‍♀️ ইমেইল এড্রেসটি দিন।
» 📌 𝐄𝐱: tempmail inbox example@domain.com
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, messageID);
			}

			if (!emailAccounts[email]) {
				return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐄𝐌𝐀𝐈𝐋 𝐍𝐎𝐓 𝐅𝐎𝐔𝐍𝐃!
» ⚠️ এই ইমেইলটি বট দিয়ে
» 🎀 তৈরি করা হয়নি অথবা
» 🥲 মেমোরিতে নেই।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, messageID);
			}

			const waitMsg = await api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ 𝐅𝐄𝐓𝐂𝐇𝐈𝐍𝐆 𝐈𝐍𝐁𝐎𝐗...
» 📩 ইনবক্স মেসেজ চেক করা
» 🕰️ হচ্ছে, অনুগ্রহ করে
» 🪯 অপেক্ষা করুন!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, messageID);

			try {
				const password = emailAccounts[email];

				const tokenRes = await axios.post(`${API}/token`, { address: email, password });
				const token = tokenRes.data?.token;

				const inboxRes = await axios.get(`${API}/messages?page=1`, {
					headers: { Authorization: `Bearer ${token}` }
				});

				const messages = inboxRes.data?.["hydra:member"] || [];

				try { api.unsendMessage(waitMsg.messageID); } catch (e) {}

				if (messages.length === 0) {
					return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📭 𝐈𝐍𝐁𝐎𝐗 𝐈𝐒 𝐄𝐌𝐏𝐓𝐘!
» ⚠️ এখনো কোনো মেসেজ 
» 🖥️ বা OTP আসেনি।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, messageID);
				}

				let out = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 📬 𝐈𝐍𝐁𝐎𝐗 𝐌𝐄𝐒𝐒𝐀𝐆𝐄𝐒 (${messages.length}):\n───────────────\n`;

				for (const msg of messages) {
					const cleanMsg = (msg.intro || "").replace(/<[^>]+>/g, "").trim();
					out += `📩 𝐅𝐫𝐨𝐦: ${msg.from?.address || "Unknown"}\n`;
					out += `📌 𝐒𝐮𝐛𝐣𝐞𝐜𝐭: ${msg.subject || "No Subject"}\n`;
					out += `✉️ 𝐌𝐞𝐬𝐬𝐚𝐠𝐞: ${cleanMsg}\n`;
					out += `───────────────\n`;
				}

				out += `» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

				return api.sendMessage(out, threadID, messageID);

			} catch (err) {
				try { api.unsendMessage(waitMsg.messageID); } catch (e) {}
				return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐄𝐑𝐑𝐎𝐑!
» ⚠️ ইনবক্স মেসেজ আনতে
» 🎀 সমস্যা হয়েছে। 
» ➡️ কিছুক্ষণ পর চেষ্টা করুন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝐀𝗧𝗕𝗢𝗧`, threadID, messageID);
			}
		}

		const waitMsg = await api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐈𝐍𝐆
» 🧚 𝐄𝐌𝐀𝐈𝐋...
» 📧 নতুন টেম্পোরারি 
» 🧙‍♀️ ইমেইল তৈরি হচ্ছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, messageID);

		try {
			const domainRes = await axios.get(`${API}/domains`);
			const domains = domainRes.data?.["hydra:member"] || [];

			if (domains.length === 0) {
				throw new Error("No domain available");
			}

			const domain = domains[0].domain;
			const randomName = Math.random().toString(36).substring(2, 10);
			const email = `${randomName}@${domain}`;
			const password = randomName + "123";

			await axios.post(`${API}/accounts`, { address: email, password });

			emailAccounts[email] = password;
			saveAccounts(emailAccounts);

			try { api.unsendMessage(waitMsg.messageID); } catch (e) {}

			return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📧 𝐘𝐎𝐔𝐑 𝐓𝐄𝐌𝐏 𝐌𝐀𝐈𝐋:
» 💌 ${email}

» 📌 𝐈𝐍𝐁𝐎𝐗 𝐂𝐇𝐄𝐂𝐊 𝐂𝐎𝐌𝐌𝐀𝐍𝐃:
» tempmail inbox ${email}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, messageID);

		} catch (err) {
			try { api.unsendMessage(waitMsg.messageID); } catch (e) {}
			return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐄𝐑𝐑𝐎𝐑!
» ⚠️ ইমেইল তৈরি করতে
» 🙂 সমস্যা হয়েছে। সার্ভারে
» 🌝 পরে চেষ্টা করুন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, messageID);
		}
	}
};
