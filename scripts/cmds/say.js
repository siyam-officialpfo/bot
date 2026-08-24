const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
  config: {
    name: "say",
    aliases: ["ট্রান্সলেট", "speak"],
    version: "2.1.0",
    author: LOCKED_AUTHOR,
    countDown: 5,
    role: 0,
    shortDescription: "Convert Text to Voice Message",
    longDescription: "Convert any typed text or replied message into a high-quality voice audio message using Google TTS engine.",
    category: "media",
    guide: "{p}say <text>\n{p}say en <text>\n{p}say hi <text>"
  },

  onStart: async function ({ api, message, event, args }) {
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      module.exports.config.author = LOCKED_AUTHOR;
      try {
        fs.writeFileSync(__filename, fs.readFileSync(__filename, "utf8"));
      } catch (e) {}
    }

    let lang = "bn"; 
    let text = "";

    if (args[0] && args[0].length === 2) {
      lang = args[0].toLowerCase();
      text = args.slice(1).join(" ") || (event.messageReply?.body ?? null);
    } else {
      text = args.join(" ") || (event.messageReply?.body ?? null);
    }

    if (!text) {
      return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
»ৎ📖 𝐕𝐎𝐈𝐂𝐄 𝐆𝐔𝐈𝐃𝐄𝐋𝐈𝐍𝐄 :
» 🤩 say যেকোনো লেখা
» 🌚 say en English Text
» ✅ ইংরেজিতে কথা 
» 🙂 বলাতে চাইলে।
» ☺️ যে কোনো মেসেজে এর
» 😀 রিপ্লাই করে say
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );
    }

    const waitingMsg = await message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
🎙️ 𝐕𝐨𝐢𝐜𝐞 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
    );

    try {
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const filePath = path.join(cacheDir, `voice_${Date.now()}.mp3`);
      
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;

      const response = await axios.get(url, { responseType: "stream" });
      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      writer.on("finish", async () => {
        if (waitingMsg && waitingMsg.messageID) api.unsendMessage(waitingMsg.messageID);
        
        return message.reply(
          {
            body: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ 𝐕𝐎𝐈𝐂𝐄 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐄𝐃!
» 🔊 ভয়েসটি প্লে করে শুনে নিন।
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
» ❌ 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐄!
» ⚠️ অডিও ফাইল তৈরি 
» 😮‍💨 করতে সমস্যা হয়েছে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
        );
      });

    } catch (err) {
      if (waitingMsg && waitingMsg.messageID) api.unsendMessage(waitingMsg.messageID);
      return message.reply( 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 😰 আল্লাহ্ গো!
» 🤒 এতো বড় লেখা...
» 😎 আমি বলবো না!
» 🌚 সিয়াম বসকে ডাক দে। 🐸
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      );
    }
  }
};
