const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
  config: {
    name: "imagine",
    aliases: ["draw", "paint", "aiimg"],
    version: "3.0.0",
    author: LOCKED_AUTHOR,
    countDown: 5,
    role: 0,
    shortDescription: "Generate AI Art and Images",
    longDescription: "Create ultra high-quality AI generated images using text prompts",
    category: "art",
    guide: "{p}imagine <text prompt>"
  },

  onStart: async function ({ api, message, event, args }) {
    // Author Security Lock
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      module.exports.config.author = LOCKED_AUTHOR;
      try {
        fs.writeFileSync(__filename, fs.readFileSync(__filename, "utf8"));
      } catch (e) {}
    }

    const prompt = args.join(" ");

    if (!prompt) {
      return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
📖 𝐈𝐌𝐀𝐆𝐈𝐍𝐄 𝐆𝐔𝐈𝐃𝐄𝐋𝐈𝐍𝐄 :
» imagine Pomot
» 🫶 যেমন: 
imagine a cute cat playing with a glowing ball in futuristic neon city
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );
    }

    const waitingMsg = await message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎨 𝗔𝗜 𝗜𝗺𝗮𝗴𝗲 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗻𝗴...
» ✅ আপনার চাহিদা চাহিদা অনুযায়ী 
» 🤖 নিঝুম বট দিয়ে ছবি তৈরি করা হচ্ছে
» 🤧 অনুগ্রহ করে অপেক্ষা করুন!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
    );

    try {
      const seed = Math.floor(Math.random() * 1000000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&nologo=true`;
      
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const filePath = path.join(cacheDir, `ai_${Date.now()}.jpg`);
      const response = await axios.get(imageUrl, { responseType: "stream" });
      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      writer.on("finish", async () => {
        if (waitingMsg && waitingMsg.messageID) api.unsendMessage(waitingMsg.messageID);
        return message.reply(
          {
            body: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ 𝐀𝐈 𝐈𝐌𝐀𝐆𝐄 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐄𝐃!
» 📝 𝗣𝗿𝗼𝗺𝗽𝘁: 
 ${prompt}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
            attachment: fs.createReadStream(filePath)
          },
          () => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          }
        );
      });

      writer.on("error", () => {
        if (waitingMsg && waitingMsg.messageID) api.unsendMessage(waitingMsg.messageID);
        return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 
» ☹️ 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐄!
» ⚠️ ছবি ডাউনলোড 
» 😮‍💨 করতে সমস্যা হয়েছে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
        );
      });

    } catch (err) {
      if (waitingMsg && waitingMsg.messageID) api.unsendMessage(waitingMsg.messageID);
      return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐒𝐘𝐒𝐓𝐄𝐌 𝐄𝐑𝐑𝐎𝐑!
» ⚠️ এআই ইঞ্জিন প্রসেস 
» ❎ করতে ব্যর্থ হয়েছে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );
    }
  }
};
