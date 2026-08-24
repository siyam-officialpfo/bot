const fs = require("fs-extra");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
  config: {
    name: "boxinfo",
    aliases: ["🎁", "বক্সইনফো", "gc2"],
    version: "6.0.0",
    author: LOCKED_AUTHOR,
    countDown: 2,
    role: 0,
    shortDescription: "Get official text-only group info with real date & time",
    longDescription: "Fetch official group details including member count, admin count, real date & time in fast text format without images",
    category: "utility",
    guide: "{p}groupinfo2"
  },

  onStart: async function ({ api, message, event }) {
    // Author Security Lock
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      module.exports.config.author = LOCKED_AUTHOR;
      try {
        fs.writeFileSync(__filename, fs.readFileSync(__filename, "utf8"));
      } catch (e) {}
    }

    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      
      const groupName = threadInfo.threadName || "নাম নাই ☹️";
      const threadID = event.threadID;
      const memberCount = threadInfo.participantIDs ? threadInfo.participantIDs.length : 0;
      const adminCount = threadInfo.adminIDs ? threadInfo.adminIDs.length : 0;
      const messageCount = threadInfo.messageCount || "N/A";
      const emoji = threadInfo.emoji || "👍 ডিফল্ট";
      const approvalMode = threadInfo.approvalMode ? "𝐎𝐍" : "𝐎𝐅𝐅";

      // Real Time & Date Calculation (Bangladesh Time Zone)
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
      const dateStr = now.toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka", day: "2-digit", month: "short", year: "numeric" });

      return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
📊 𝐆𝐑𝐎𝐔𝐏 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍
» 🏷️ 𝐆𝐫𝐨𝐮𝐩 𝐍𝐚𝐦𝐞 : ${groupName}
» 🆔 𝐓𝐡𝐫𝐞𝐚𝐝 𝐈𝐃 : 
» 🆔 ${threadID}
» 👥 𝐌𝐞𝐦𝐛𝐞𝐫𝐬 : ${memberCount} জন
» 👑 𝐀𝐝𝐦𝐢𝐧𝐬 : ${adminCount} জন
» 💬 𝐌𝐞𝐬𝐬𝐚𝐠𝐞𝐬 : ${messageCount} টি
» 🎨 𝐆𝐜 𝐄𝐦𝐨𝐣𝐢 : ${emoji}
» 🔒 𝐀𝐩𝐩𝐫𝐨𝐯𝐚𝐥 𝐌𝐨𝐝𝐞 : ${approvalMode}
» ⏰ 𝐓𝐢𝐦𝐞 : ${timeStr}
» 📅 𝐃𝐚𝐭𝐞 : ${dateStr}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );
    } catch (err) {
      return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐒𝐘𝐒𝐓𝐄𝐌 𝐄𝐑𝐑𝐎𝐑!
» ⚠️ গ্রুপ ইনফরমেশন 
» 🫢 লোড করতে ব্যর্থ হয়েছে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );
    }
  }
};
