const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

const baseApiUrl = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
  );
  return base.data.mahmud;
};

/**
* @author 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
*/

module.exports = {
  config: {
    name: "toilet",
    version: "1.7",
    author: LOCKED_AUTHOR,
    role: 0,
    category: "fun",
    cooldown: 10,
    guide: "[mention/reply/UID]",
  },

  onStart: async function({ api, event, args }) {
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      module.exports.config.author = LOCKED_AUTHOR;
    }

    const { mentions, threadID, messageID, messageReply } = event;
    let id;

    if (Object.keys(mentions).length > 0) {
      id = Object.keys(mentions)[0];
    } else if (messageReply) {
      id = messageReply.senderID;
    } else if (args[0]) {
      id = args[0]; 
    } else {
      return api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
        ───────────────
        » ⚠️ 𝐏𝐋𝐄𝐀𝐒𝐄 𝐌𝐄𝐍𝐓𝐈𝐎𝐍
        » 😓 𝐑𝐄𝐏𝐋𝐘 𝐎𝐑 𝐆𝐈𝐕𝐄 𝐔𝐈𝐃!
        ───────────────
        » 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        threadID,
        messageID
      );
    }

    try {
      const apiUrl = await baseApiUrl();
      const url = `${apiUrl}/api/toilet?user=${id}`;

      const response = await axios.get(url, { responseType: "arraybuffer" });
      const filePath = path.join(__dirname, `toilet_${id}.png`);
      fs.writeFileSync(filePath, response.data);
      
      return api.sendMessage(
        {
          body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
          ───────────────
          » 🤮 ওয়াক থু! এই নে 
          » 😹 গু খেয়ে মর তুই 
          » 🌚 গু খাওয়ার যোগ্য। 😜🤣
          ───────────────
          » 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => fs.unlinkSync(filePath),
        messageID
      );

    } catch (err) {
      return api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
        ───────────────
        » ❌ 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 
        » 😧 𝐏𝐑𝐎𝐂𝐄𝐒𝐒 𝐑𝐄𝐐𝐔𝐄𝐒𝐓!
        ───────────────
        » 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        threadID,
        messageID
      );
    }
  }
};
