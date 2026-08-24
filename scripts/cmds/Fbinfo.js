const fs = require("fs-extra");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
  config: {
    name: "fbinfo",
    aliases: ["fb", "ইনফো", "uidinfo"],
    version: "5.0.0",
    author: LOCKED_AUTHOR,
    countDown: 2,
    role: 0,
    shortDescription: "Get official text-based Facebook user info",
    longDescription: "Fetch official Facebook user profile details fast without images",
    category: "utility",
    guide: "{p}userinfo [@mention / reply to message / UID]"
  },

  onStart: async function ({ api, message, event, args, usersData }) {
    // Author Security Lock
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      module.exports.config.author = LOCKED_AUTHOR;
      try {
        fs.writeFileSync(__filename, fs.readFileSync(__filename, "utf8"));
      } catch (e) {}
    }

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

    try {
      const infoRes = await api.getUserInfo(targetID);
      const userInfo = (infoRes && infoRes[targetID]) ? infoRes[targetID] : {};

      const name = userInfo.name || (await usersData.getName(targetID)) || "Facebook User";
      const genderNum = userInfo.gender;
      const gender = genderNum === 2 ? "𝐌𝐀𝐋𝐄 পুরুষ" : genderNum === 1 ? "𝐅𝐄𝐌𝐀𝐋𝐄 নারী" : "Private / Hidden";
      const username = userInfo.vanity ? `@${userInfo.vanity}` : "নেই";
      const isFriend = userInfo.isFriend ? "হ্যাঁ বটের ফ্রেন্ড" : "ফ্রেন্ড না";
      const profileUrl = userInfo.profileUrl || `https://www.facebook.com/profile.php?id=${targetID}`;
      const isBirthdayToday = userInfo.isBirthday ? "আজকে জন্মদিন 🎉" : "জন্মদিন নয়";

      return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
👤 𝐔𝐒𝐄𝐑 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 𝐈𝐍𝐅𝐎

» 📛 𝐍𝐚𝐦𝐞 : ${name}
» 🆔 𝐔𝐈𝐃 : ${targetID}
» 🏷️ 𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞 : ${username}
» 👤 𝐆𝐞𝐧𝐝𝐞𝐫 : ${gender}
» 🤝 𝐅𝐫𝐢𝐞𝐧𝐝 : ${isFriend}
» 🎂 𝐁𝐢𝐫𝐭𝐡𝐝𝐚𝐲 : ${isBirthdayToday}
» 🔗 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 : ${profileUrl}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );
    } catch (err) {
      return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐒𝐘𝐒𝐓𝐄𝐌 𝐄𝐑𝐑𝐎𝐑!
» ⚠️ ফেসবুক থেকে ইউজার 
» 🤔 ইনফরমেশন লোড করা জাইনি।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );
    }
  }
};
