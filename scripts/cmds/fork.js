if (!global.forkCounter) {
  global.forkCounter = {};
}
module.exports = {
  config: {
    name: "fork",
    version: "3.0.0",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 2,
    role: 0,
    shortDescription: "Official GitHub Fork",
    category: "utils",
    guide: {
      en: "{pn} | fork"
    }
  },
  onStart: async function ({ api, event, message }) {
    const threadID = event.threadID;
    const loadingFrames = ["▱", "▰▱", "▰▱", "▰"];
    
    api.sendTypingIndicator(threadID, true);
    // লোডিং মেসেজ পাঠানো
    let loadingMsg = await message.reply("💠 INITIATING FORK PROTOCOL...\n▱ 0%");
    
    for (let i = 0; i < loadingFrames.length; i++) {
      await new Promise(r => setTimeout(r, 250));
      try {
        await api.editMessage(`⏳INITIATING FORK PROTOCOL...\n${loadingFrames[i]} ${25 + i * 25}%`, loadingMsg.messageID);
      } catch(e) {}
    }
    api.sendTypingIndicator(threadID, false);
    
    const threadInfo = await api.getThreadInfo(threadID);
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const ping = Date.now() - event.timestamp;
    
    if (global.forkCounter[threadID] === undefined) {
      global.forkCounter[threadID] = 0;
    } else {
      global.forkCounter[threadID] = (global.forkCounter[threadID] + 1) % 3;
    }
    const currentDesign = global.forkCounter[threadID];
    
    let card = "";
    
    if (currentDesign === 0) {
      card = `〔 👑  𝗚𝗢𝗔𝗧 𝗕𝗢𝗧 𝗩𝟱 👑 〕

│ 👤 𝗕𝗼𝘁: 𝗚𝗢𝗔𝗧 𝗕𝗢𝗧 𝗩𝟱
│ 🔰 𝗣𝗥𝗘𝗙𝗜𝗫 ➜ { , }
│ 📊 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 ➜ 𝟔𝟎𝟗𝟔
│ 📱 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣:
│ 📞 +𝟴𝟴𝟬𝟭𝟳𝟴𝟵𝟭𝟯𝟴𝟭𝟱𝟳
├─────────────────
│ ⏱️ UPTIME: ${hours}h ${minutes}m
│ 👥 USERS: ${threadInfo.participantIDs.length} Members
│ 📡 PING: ${ping}ms
├─────────────────

  🔗 𝗚𝗜𝗧𝗛𝗨𝗕 : https://github.com/siyamxpro/siyamxpro.git`;
    } 
    
    else if (currentDesign === 1) {
      card = `📡 𝗠𝗔𝗧𝗥𝗜𝗫 𝗦𝗬𝗦𝗧𝗘𝗠 🔰

━━━━━━━━━━━━━━━━━━
⚡ 𝗖𝗢𝗥𝗘 ➜  𝗚𝗢𝗔𝗧 𝗕𝗢𝗧 𝗩𝟱
👤 𝗗𝗘𝗩 ➜ 👑-𝐒𝐈𝐘𝐀𝐌-👑
📊 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 ➜ 𝟔𝟎𝟗𝟔
🔰 𝗣𝗥𝗘𝗙𝗜𝗫 ➜ { , }
📱 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣:
📞 +𝟴𝟴𝟬𝟭𝟳𝟴𝟵𝟭𝟯𝟴𝟭𝟱𝟳
⏱️ 𝗟𝗜𝗩𝗘 ➜ ${hours}h ${minutes}m | 📡 ${ping}ms

👥 𝗥𝗢𝗢𝗠 ➜ ${threadInfo.participantIDs.length} Active Users

━━━━━━━━━━━━━━━━━━

📥 𝗚𝗜𝗧𝗛𝗨𝗕 𝗥𝗘𝗣𝗢𝗦𝗜𝗧𝗢𝗥𝗬

🔗 𝗚𝗜𝗧𝗛𝗨𝗕 : https://github.com/siyamxpro/siyamxpro.git`;
    } 
    
    else if (currentDesign === 2) {
      card = `💠𝖯𝖱𝖤𝖬𝖨𝖴𝖬 𝖥𝖮𝖱𝖪🔰

──────────────────
» 👑 𝗢𝘄𝗻𝗲𝗿: 👑-𝗦𝗜𝗬𝗔𝗠-👑
» 🤖 𝗕𝗼𝘁: 𝗚𝗢𝗔𝗧 𝗕𝗢𝗧 𝗩𝟱
» 🔰 𝗣𝗥𝗘𝗙𝗜𝗫 ➜ { , }
» 📊 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 ➜ 𝟔𝟎𝟗𝟔
» 📱 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 ➜ 
» 📞 +𝟴𝟴𝟬𝟭𝟳𝟴𝟵𝟭𝟯𝟴𝟭𝟱𝟳
» 📊 𝗦𝗧𝗔𝗧𝗦 ➜ ${hours}𝗵 ${minutes}𝗺 │ ${ping}𝗺𝘀 │ ${threadInfo.participantIDs.length} 𝗠𝗘𝗠𝗕𝗘𝗥𝗦

──────────────────

»🔗 𝗚𝗜𝗧𝗛𝗨𝗕 : https://github.com/siyamxpro/siyamxpro.git`;
    }
    
    await message.reply(card);
    
    try {
      if (loadingMsg && loadingMsg.messageID) {
        await api.unsendMessage(loadingMsg.messageID);
      }
    } catch (e) {}
  },
  onChat: async function ({ api, event, message }) {
    const body = event.body?.trim().toLowerCase();
    if (body === "fork") {
      return;
    }
  }
};
