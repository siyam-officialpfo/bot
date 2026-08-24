const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

const CRIMES = [
  "রাত ৩টায় একা একা নুডুলস রান্না করে খাওয়া!",
  "চ্যাটগ্রুপে সারাদিন শুধু 'হুম' আর 'ওহ' মেসেজ দেওয়া!",
  "সবাইকে পাম দিয়ে কাজ করিয়ে চম্পট দেওয়া!",
  "পোস্টে লাইক না দিয়ে কমেন্টে গিয়ে ফাজলামো করা!",
  "অন্যের সিঙ্গেল লাইফে আগুন লাগিয়ে নিজে কিউট সেজে থাকা!",
  "গ্রুপের সবার গোপন ক্রাশের খবর ফাঁস করে দেওয়া!",
  "ফেসবুকে ডিএসএলআর পিক দিয়ে বাস্তবে না চেনা যাওয়া!"
];

const REWARDS = [
  "৫০,০০০,০০০ টাকা ও ১ কাপ লাল চা ☕",
  "১ বস্তা আলু ও ২টা কাঁচামরিচ 🌶️",
  "১টি ফ্রিতে বিয়ের দাওয়াত 🍗",
  "১০০ টাকা মোবাইল রিচার্জ 📱",
  "১টি অরিজিনাল রসগোল্লা 🧆"
];

module.exports = {
  config: {
    name: "poster",
    aliases: ["পোস্টার", "po", "আসামি"],
    version: "2.5.0",
    author: LOCKED_AUTHOR,
    countDown: 5,
    role: 0,
    shortDescription: "Generate Wanted Poster for Fun",
    longDescription: "Create a funny WANTED dead or alive poster using target user avatar",
    category: "fun",
    guide: "{p}wanted [@mention / reply / leave empty]"
  },

  onStart: async function ({ api, message, event, args, usersData }) {
    // Author Security Lock
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      module.exports.config.author = LOCKED_AUTHOR;
      try {
        fs.writeFileSync(__filename, fs.readFileSync(__filename, "utf8"));
      } catch (e) {}
    }

    // Determine target ID
    let targetID;
    if (event.type === "message_reply") {
      targetID = event.messageReply.senderID;
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetID = Object.keys(event.mentions)[0];
    } else if (args[0] && !isNaN(args[0])) {
      targetID = args[0];
    } else {
      targetID = event.senderID;
    }

    const waitingMsg = await message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗪𝗮𝗶𝘁...
» 🥵 আসামি ধরা পড়েছে! 
» 🫣 ওয়ান্টেড পোস্টার তৈরি হচ্ছে...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
    );

    try {
      const name = await usersData.getName(targetID);
      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      
      const posterApi = `https://api.popcat.xyz/wanted?image=${encodeURIComponent(avatarUrl)}`;

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const filePath = path.join(cacheDir, `wanted_${Date.now()}.png`);
      const response = await axios.get(posterApi, { responseType: "stream" });
      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      const randomCrime = CRIMES[Math.floor(Math.random() * CRIMES.length)];
      const randomReward = REWARDS[Math.floor(Math.random() * REWARDS.length)];

      writer.on("finish", async () => {
        if (waitingMsg && waitingMsg.messageID) api.unsendMessage(waitingMsg.messageID);
        return message.reply(
          {
            body: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
🚨 𝐖𝐀𝐍𝐓𝐄𝐃 𝐂𝐑𝐈𝐌𝐈𝐍𝐀𝐋 🚨

👤 𝐀𝐬𝐚𝐦𝐢 : ${name}
🆔 𝐈𝐃 : ${targetID}
💰 𝐏𝐮𝐫𝐨𝐬𝐤𝐚𝐫 : ${randomReward}
📝 𝐎𝐩𝐨𝐫𝐚𝐝𝐡 : 
${randomCrime}
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
» ❌ 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 𝐂𝐑𝐄𝐀𝐓𝐄!
» ⚠️ ওয়ান্টেড পোস্টার 
» 🌚 বানাতে সমস্যা হয়েছে।
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
» ⚠️ পোস্টার প্রসেস 
» 💋 করতে ব্যর্থ হয়েছে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );
    }
  }
};
