const fs = require("fs-extra");
const path = __dirname + "/cache/autoseen.json";

// 🔒 AUTHOR LOCK
const LOCKED_AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

// যদি ফাইল না থাকে, বাই-ডিফল্ট status: false দিয়ে ফাইল বানানো হবে
if (!fs.existsSync(path)) {
  fs.writeFileSync(path, JSON.stringify({ status: false }, null, 2));
}

// অটো জেনারেট বা মেসেজের ইংরেজি লেখাকে স্টাইলিশ করার ফাংশন
function toBoldStyle(text) {
  if (!text) return "";
  const normalChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const boldChars   = "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗";
  
  return text.toString().split("").map(char => {
    const index = normalChars.indexOf(char);
    return index !== -1 ? boldChars.substring(index * 2, (index * 2) + 2) : char;
  }).join("");
}

module.exports = {
  config: {
    name: "autoseen",
    version: "𝟐.𝟎",
    author: LOCKED_AUTHOR,
    countDown: 0,
    role: 0,
    shortDescription: "স্বয়ংক্রিয়ভাবে seen সিস্টেম",
    longDescription: "বট স্বয়ংক্রিয়ভাবে সকল নতুন মেসেজ seen করবে।",
    category: "𝐬𝐲𝐬𝐭𝐞𝐦",
    guide: {
      en: "{𝐩𝐧} 𝐨𝐧/𝐨𝐟𝐟",
    },
  },

  onStart: async function ({ message, args }) {
    // 🔒 AUTHOR CHECK (LOCK SYSTEM)
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      console.log("🚫 𝐅𝐈𝐋𝐄 𝐋𝐎𝐂𝐊𝐄𝐃: 𝐀𝐮𝐭𝐡𝐨𝐫 𝐜𝐡𝐚𝐧𝐠𝐞𝐝!");
      return;
    }

    const data = JSON.parse(fs.readFileSync(path));

    if (!args[0]) {
      return message.reply(
        `📄 ${toBoldStyle("Autoseen")} বর্তমান অবস্থা: ${data.status ? "✅ চালু" : "❌ বন্ধ"}`
      );
    }

    if (args[0].toLowerCase() === "on") {
      data.status = true;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return message.reply(`✅ ${toBoldStyle("Autoseen")} এখন থেকে চালু!`);
    } 
    
    else if (args[0].toLowerCase() === "off") {
      data.status = false;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return message.reply(`❌ ${toBoldStyle("Autoseen")} এখন বন্ধ!`);
    } 
    
    else {
      return message.reply(`⚠️ ব্যবহার করুন: ${toBoldStyle("autoseen on / off")}`);
    }
  },

  onChat: async function ({ event, api }) {
    try {
      // 🔒 AUTHOR CHECK (CHAT LEVEL SAFETY)
      if (module.exports.config.author !== LOCKED_AUTHOR) {
        console.log("🚫 𝐅𝐈𝐋𝐄 𝐋𝐎𝐂𝐊𝐄𝐃: 𝐀𝐮𝐭𝐡𝐨𝐫 𝐜𝐡𝐚𝐧𝐠𝐞𝐝!");
        return;
      }

      const data = JSON.parse(fs.readFileSync(path));
      if (data.status === true) {
        api.markAsReadAll();
      }
    } catch (e) {
      console.error(e);
    }
  },
};
