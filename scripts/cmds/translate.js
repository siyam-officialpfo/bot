const axios = require("axios");
const fs = require("fs-extra");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
  config: {
    name: "translate",
    aliases: ["trans", "tr", "অনুবাদ"],
    version: "3.0.0",
    author: LOCKED_AUTHOR,
    countDown: 2,
    role: 0,
    shortDescription: "Translate text to Bengali or any language",
    longDescription: "Translate any typed text or replied message into Bengali or specified language fast using Google Translate engine",
    category: "utility",
    guide: "{p}translate <text> or reply to a message with {p}translate [lang_code]"
  },

  onStart: async function ({ api, message, event, args }) {
    // Author Security Lock
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      module.exports.config.author = LOCKED_AUTHOR;
      try {
        fs.writeFileSync(__filename, fs.readFileSync(__filename, "utf8"));
      } catch (e) {}
    }

    let text = "";
    let targetLang = "bn";

    if (event.type === "message_reply") {
      text = event.messageReply.body;
      if (args[0] && args[0].length === 2) {
        targetLang = args[0].toLowerCase();
      }
    } else {
      if (args[0] && args[0].length === 2 && args.length > 1) {
        targetLang = args[0].toLowerCase();
        text = args.slice(1).join(" ");
      } else {
        text = args.join(" ");
      }
    }

    if (!text) {
      return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑 
━━━━━━━━━━━━━━ 
📖 𝐓𝐑𝐀𝐍𝐒𝐋𝐀𝐓𝐄 𝐆𝐔𝐈𝐃𝐄 :

» 𝐭𝐫𝐚𝐧𝐬𝐥𝐚𝐭𝐞 লেখা ↳ যেকোনো ভাষা 
➜ বাংলায় অনুবাদ।

» 𝐭𝐫𝐚𝐧𝐬𝐥𝐚𝐭𝐞 𝐞𝐧 লেখা ↳ যেকোনো ভাষা 
➜ ইংরেজিতে অনুবাদ।

» 𝐦𝐞𝐬𝐬𝐚𝐠𝐞-এ 𝐫𝐞𝐩𝐥𝐲 করে 𝐭𝐫𝐚𝐧𝐬𝐥𝐚𝐭𝐞 
↳ রিপ্লাই করা মেসেজ 
➜ বাংলায় অনুবাদ। 
━━━━━━━━━━━━━━ 
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );
    }

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await axios.get(url);
      
      let translatedText = "";
      if (res.data && res.data[0]) {
        res.data[0].forEach(item => {
          if (item[0]) translatedText += item[0];
        });
      }

      const detectedLang = res.data && res.data[2] ? res.data[2].toUpperCase() : "AUTO";

      if (!translatedText) {
        return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐓𝐑𝐀𝐍𝐒𝐋𝐀𝐓𝐈𝐎𝐍 𝐅𝐀𝐈𝐋𝐄𝐃!
» ⚠️ অনুবাদ করতে ব্যর্থ হয়েছে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
        );
      }

      return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
🌐 𝐆𝐎𝐎𝐆𝐋𝐄 𝐓𝐑𝐀𝐍𝐒𝐋𝐀𝐓𝐎𝐑

🌐 𝐅𝐫𝐨𝐦 : ${detectedLang} ➡️ ${targetLang.toUpperCase()}

📝 𝐓𝐫𝐚𝐧𝐬𝐥𝐚𝐭𝐢𝐨𝐧 :
${translatedText}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );

    } catch (err) {
      return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐒𝐘𝐒𝐓𝐄𝐌 𝐄𝐑𝐑𝐎𝐑!
» ⚠️ অনুবাদ সার্ভার থেকে 
» ❎ সাড়া পাওয়া যায়নি।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );
    }
  }
};
