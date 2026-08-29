const { getStreamsFromAttachment } = global.utils;
const mediaTypes = ["photo", "png", "animated_image", "video", "audio"];

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
  config: {
    name: "bridge",
    aliases: ["রিপ্লাই", "কল"],
    version: "24.0.0",
    author: LOCKED_AUTHOR,
    countDown: 1,
    role: 0,
    shortDescription: "গ্রুপ চ্যাট ব্রিজ এবং কানেকশন সিস্টেম",
    category: "Communication",
    guide: { 
      en: "{pn} list | সক্রিয় গ্রুপ দেখতে এবং সংযোগ করতে [নাম্বার] [মেসেজ] লিখে রিপ্লাই দিন" 
    }
  },

  onStart: async function ({ api, event, args, message }) {
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      module.exports.config.author = LOCKED_AUTHOR;
    }

    const { threadID } = event;
    const botID = api.getCurrentUserID();

    if (args[0] === "list") {
      try {
        const list = await api.getThreadList(200, null, ["INBOX"]);
        let msg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🏢 𝐀𝐂𝐓𝗜𝗩𝐄 𝐆𝐑𝐎𝐔𝐏𝐒 𝐋𝐈𝐒𝐓
`;
        let count = 1;
        const groupData = [];

        for (const item of list) {
          if (item.isGroup && item.threadID !== threadID && item.participantIDs.includes(botID)) {
            msg += `» ${count}. 🏷️ ${item.name || "Unnamed Group"}\n`;
            groupData.push({
              index: count,
              threadID: item.threadID
            });
            count++;
          }
        }

        if (count === 1) return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐍𝐎 𝐀𝐂𝐓𝗜𝗩𝐄 
» 🚼 𝐆𝐑𝐎𝐔𝐏𝐒 𝐅𝐎𝐔𝐍𝐃!
» ⚠️ কোনো গ্রুপ পাওয়া যায়নি।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
        );

        msg += 
`───────────────
» 💡 𝐑𝐄𝐏𝐋𝐘 𝐖𝐈𝐓𝐇 
» 🥁 [𝐍𝐮𝐦𝐛𝐞𝐫] [𝐌𝐞𝐬𝐬𝐚𝐠𝐞] 
» 🧞‍♂️ 𝐓𝐎 𝐂𝐎𝐍𝐍𝐄𝐂𝐓
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        
        return message.reply(msg, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "listReply",
            groupData: groupData,
            messageID: info.messageID
          });
        });
      } catch (err) {
        return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 𝐋𝐎𝐀𝐃 
» 😅 𝐆𝐑𝐎𝐔𝐏𝐒!
» ⚠️ গ্রুপ তালিকা লোড 
» 🧘 করতে ব্যর্থ হয়েছে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
        );
      }
    }
    
    return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝐔𝐒𝐄 𝐛𝐫𝐢𝐝𝐠𝐞 𝐥𝐢𝐬𝐭 𝐓𝐎 
» ↪️ 𝐒𝐄𝐄 𝐀𝐂𝐓𝐈𝗩𝐄 𝐆𝐑𝐎𝐔𝐏𝐒!
» 💡 গ্রুপ তালিকা দেখতে 
» 🧑‍💻 কমান্ড ব্যবহার করুন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
    );
  },

  onReply: async function ({ api, event, Reply, usersData, message }) {
    const { threadID, messageID, senderID, body, attachments } = event;
    const senderName = await usersData.getName(senderID);

    if (Reply.type === "listReply") {
      const input = body.split(" ");
      const serial = parseInt(input[0]);
      const content = input.slice(1).join(" ");

      const targetGroup = Reply.groupData.find(g => g.index === serial);
      if (!targetGroup) return; 

      if (!content) return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝐏𝐋𝐄𝐀𝐒𝐄 𝐄𝐍𝐓𝐄𝐑 
» 🎁 𝐀 𝐌𝐄𝐒𝐒𝐀𝐆𝐄!
» ✍️ দয়া করে নাম্বারের পর 
» 🥰 আপনার মেসেজটি লিখুন।
» 😪 যেমন: সিয়াম ভাই বট কই 
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );

      const formMessage = {
        body: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 👤 𝐅𝐑𝐎𝐌 : ${senderName}
» 💬 𝐌𝐄𝐒𝐒𝐀𝐆𝐄 : 
 ${content}
───────────────
» ↩️ এই মেসেজের রিপ্লাই দিন
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        attachment: await getStreamsFromAttachment(attachments.filter(item => mediaTypes.includes(item.type)))
      };

      return api.sendMessage(formMessage, targetGroup.threadID, (err, info) => {
        if (err) return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐌𝐄𝐒𝐒𝐀𝐆𝐄 𝐅𝐀𝐈𝐋𝐄𝐃!
» ⚠️ বট এই গ্রুপে নেই 
» 🧞‍♂️ মেসেজ পাঠানো যায়নি।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
        );
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "bridgeChat",
          targetMessageID: info.messageID,
          backToTID: threadID,
          backToMID: messageID
        });
        message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃 
» 🫶🏾 𝐓𝐎 𝐆𝐑𝐎𝐔𝐏 #${serial}!
» 🔗 সফলভাবে গ্রুপে বার্তা 
» 🤩 পাঠানো হয়েছে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
        );
      });
    }

    if (Reply.type === "bridgeChat") {
      const sendToTID = (threadID == Reply.backToTID) ? Reply.targetMessageID : Reply.backToTID;
      const replyToMID = (threadID == Reply.backToTID) ? Reply.targetMessageID : Reply.backToMID;

      const formMessage = {
        body: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📩 𝐑𝐄𝐏𝐋𝐘 𝐅𝐑𝐎𝗠 : ${senderName}
» 💬 ${body || "Sent an attachment / একটি ফাইল পাঠিয়েছেন"}
───────────────
» 🔄 এই মেসেজের রিপ্লাই দিন
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        attachment: await getStreamsFromAttachment(attachments.filter(item => mediaTypes.includes(item.type)))
      };

      try {
        api.sendMessage(formMessage, sendToTID, (err, info) => {
          if (err) return;
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "bridgeChat",
            targetMessageID: info.messageID,
            backToTID: threadID,
            backToMID: messageID
          });
        }, replyToMID);
        api.setMessageReaction("✅", messageID, () => {}, true);
      } catch (e) {
        console.error(e);
      }
    }
  }
};
