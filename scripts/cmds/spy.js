const fs = require("fs-extra");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
  config: {
    name: "spy",
    version: "1.5.0",
    author: LOCKED_AUTHOR,
    role: 0,
    countDown: 5,
    shortDescription: "Deep dive into user stats",
    longDescription: "Fetch complete profile details including UID, balance, level, rank, location, with reactions.",
    category: "utility",
  },

  onStart: async function ({ event, message, api, usersData, args }) {
    // siyam to do and then we can get a date with 
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      module.exports.config.author = LOCKED_AUTHOR;
      try {
        fs.writeFileSync(__filename, fs.readFileSync(__filename, "utf8"));
      } catch (e) {}
    }

    const requesterID = event.senderID;
    const mentionIDs = Object.keys(event.mentions || {});
    let targetID = mentionIDs[0];

    api.setMessageReaction(event.messageID, "🕜", () => {}, true);

    if (args[0]) {
      const numeric = /^\d+$/.test(args[0]) ? args[0] : null;
      const linkMatch = args[0].match(/profile\.php\?id=(\d+)/);
      targetID = numeric || (linkMatch ? linkMatch[1] : targetID);
    }

    if (!targetID) targetID = event.type === "message_reply" ? event.messageReply.senderID : requesterID;

    try {
      const fbData = await new Promise((resolve, reject) => {
        api.getUserInfo(targetID, (err, result) => (err ? reject(err) : resolve(result)));
      });

      const avatarLink = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

      const userRecord = await usersData.get(targetID);
      const requesterRecord = await usersData.get(requesterID);
      const requesterName = requesterRecord.name || "Friend";

      const fullName = fbData[targetID].name || "N/A";
      const genderStr = fbData[targetID].gender === 1 ? "Female" : fbData[targetID].gender === 2 ? "Male" : "Unknown";
      const isFriend = fbData[targetID].isFriend ? "✅ Yes" : "❌ No";
      const birthday = fbData[targetID].isBirthday ? "🎉 Today!" : "🔒 Hidden";
      const balance = userRecord.money || 0;
      const xp = userRecord.exp || 0;
      const lvl = Math.floor(Math.sqrt(xp) * 0.1);

      const threadInfo = event.threadID ? await api.getThreadInfo(event.threadID) : {};
      const nickname = threadInfo.nicknames?.[targetID] || "—";

      const location = fbData[targetID].hometown_name || "Unknown";

      const allUsers = await usersData.getAll();
      const rankIdx = allUsers
        .filter(u => typeof u.money === "number")
        .sort((a, b) => b.money - a.money)
        .findIndex(u => u.userID === targetID);
      const rank = rankIdx !== -1 ? `#${rankIdx + 1}` : "—";

      const cardMessage = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
🚀 𝐔𝐒𝐄𝐑 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 𝐈𝐍𝐒𝐈𝐆𝐇𝐓

» 👤 𝐍𝐚𝐦𝐞 : ${fullName}
» 💬 𝐍𝐢𝐜𝐤𝐧𝐚𝐦𝐞 : ${nickname}
» 🆔 𝐔𝐈𝐃 : ${targetID}

» 💸 𝐁𝐚𝐥𝐚𝐧𝐜𝐞 : $${balance}
» ⚡ 𝐗𝐏 : ${xp}
» 🎚️ 𝐋𝐞𝐯𝐞𝐥 : ${lvl}
» 🏅 𝐑𝐚𝐧𝐤 : ${rank}

» ⚧️ 𝐆𝐞𝐧𝐝𝐞𝐫 : ${genderStr}
» 🎂 𝐁𝐢𝐫𝐭𝐡𝐝𝐚𝐲 : ${birthday}
» 📍 𝐋𝐨𝐜𝐚𝐭𝐢𝐨𝐧 : ${location}
» 🤝 𝐅𝐫𝐢𝐞𝐧𝐝 : ${isFriend}
» 💌 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧 : Single

» 🔗 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 : https://www.facebook.com/${targetID}
» 🎁 𝐑𝐞 𝐛𝐲 : ${requesterName}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      await message.reply({
        body: cardMessage,
        attachment: await global.utils.getStreamFromURL(avatarLink),
      });

      api.setMessageReaction(event.messageID, "✅", () => {}, true);

    } catch (err) {
      console.error(err);
      return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐒𝐘𝐒𝐓𝐄𝐌 𝐄𝐑𝐑𝐎𝐑!
» ⚠️ প্রফাইল ইনফরমেশন 
» ✅ লোড করতে ব্যর্থ হয়েছে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );
    }
  },
};
