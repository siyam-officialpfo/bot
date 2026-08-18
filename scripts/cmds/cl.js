const fs = require("fs");
const path = require("path");
const axios = require("axios");

async function baseApiUrl() {
  const res = await axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/ApiUrl.json");
  return res.data.gist;
}

module.exports = {
  config: {
    name: "cl",
    version: "2.0",
    role: 1,
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    description: "Generate Gist from code or bot files",
    category: "convert",
    guide: "{pn} [file] | Reply to code",
    countDown: 1
  },

  onStart: async function ({ api, event, args }) {
    // আপনার পছন্দের ডিজাইন ফরম্যাট
    const formatMsg = (text) => 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
  ${text}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    try {
      let fileName = args[0];
      let code = "";

      // 'cl' অথবা প্রচলিত পদ্ধতিতে ফাইলের নাম হ্যান্ডেল করা
      if (fileName === "cl") {
        fileName = args[1] || "";
      }

      if (event.type === "message_reply" && event.messageReply?.body) {
        code = event.messageReply.body;
        if (!fileName) fileName = `gist_${Date.now()}.js`;
        if (!fileName.endsWith(".js")) fileName += ".js";
      } else if (fileName) {
        let folder = "../../scripts/cmds";

        if (args[0] === "-e" || args[1] === "-e") {
          folder = "../../scripts/events";
          fileName = args[0] === "-e" ? args[1] : args[2];
        }

        if (!fileName) return api.sendMessage(formatMsg("⚠️ File name missing."), event.threadID);

        if (!fileName.endsWith(".js")) fileName += ".js";

        const filePath = path.resolve(__dirname, folder, fileName);

        if (!fs.existsSync(filePath))
          return api.sendMessage(formatMsg(`❌ ${fileName} not found.`), event.threadID);

        code = fs.readFileSync(filePath, "utf8");
      } else {
        return api.sendMessage(formatMsg("⚠️ Reply to code or give a file name."), event.threadID);
      }

      const apiUrl = await baseApiUrl();

      const res = await axios.post(`${apiUrl}/gist`, {
        code: encodeURIComponent(code),
        nam: fileName
      });

      return api.sendMessage(formatMsg(`🔗 Gist Link:\n${res.data.data}`), event.threadID);

    } catch (e) {
      console.error(e);
      return api.sendMessage(formatMsg("❌ Failed to create gist."), event.threadID);
    }
  }
};
