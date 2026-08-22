const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const baseApiUrl = async () => {
  try {
    const res = await axios.get(
      "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
    );
    return res.data.mahmud;
  } catch (e) {
    return "https://default-api.example.com";
  }
};

const apiList = async () => {
  const base = await baseApiUrl();
  return [
    base,
    "https://mahmudx7-api.vercel.app",
    "https://backup-api.example.com"
  ];
};

async function fetchWithFallback(urlBuilder) {
  const apis = await apiList();

  for (let base of apis) {
    try {
      const url = urlBuilder(base);
      const res = await axios.get(url, { timeout: 15000 });
      if (res?.data) return res.data;
    } catch (e) {}
  }

  throw new Error("All APIs failed");
}

module.exports = {
  config: {
    name: "ytb",
    aliases: ["youtube", "yt", "ytb2"], // ytb2 কে অ্যালাইয়াস হিসেবে যোগ করা হলো
    version: "2.3",
    author: "Siyam Hasan",
    countDown: 6,
    role: 0,
    description: {
      bn: "YouTube ভিডিও সার্চ ও ডাউনলোড (ytb থাম্বনেইল সহ, ytb2 থাম্বনেইল ছাড়া)",
      en: "YouTube search & download system (ytb with thumbnail, ytb2 without thumbnail)"
    },
    category: "media"
  },

  langs: {
    bn: {
      error: "❌ সমস্যা: %1",
      noResult: "⭕ কিছু পাওয়া যায়নি: %1",
      choose: "📌 নাম্বার দিয়ে রিপ্লাই করো:\n\n%1",
      downloading: "⬇️ ডাউনলোড হচ্ছে: %1 - %2"
    }
  },

  onStart: async function ({ api, args, event, getLang }) {
    const { threadID, messageID, senderID } = event;
    const input = args.join(" ").trim();

    if (!input) {
      return api.sendMessage("👉 ব্যবহার: ytb song name অথবা ytb2 song name", threadID, messageID);
    }

    // ইউজার কোন কমান্ডটি ব্যবহার করেছে তা চেক করার লজিক
    const usedCommand = event.body.split(" ")[0].toLowerCase();
    const isYtb2 = usedCommand.includes("ytb2");

    try {
      api.setMessageReaction("🔎", messageID, () => {}, true);

      const data = await fetchWithFallback((base) =>
        `${base}/api/ytb/search?q=${encodeURIComponent(input)}`
      );

      const results = data?.results?.slice(0, 6);

      if (!results?.length) {
        return api.sendMessage(getLang("noResult", input), threadID, messageID);
      }

      const cacheDir = path.join(__dirname, "cache");
      fs.ensureDirSync(cacheDir);

      let msg = "";
      let attachments = [];

      // যদি ytb2 কমান্ড ব্যবহার করা হয়, তবে থাম্বনেইল ডাউনলোড স্কিপ করবে (ফাস্ট লোড)
      if (!isYtb2) {
        // ⚡ FAST THUMBNAIL LOAD (parallel)
        const thumbs = await Promise.all(
          results.map(async (r, i) => {
            try {
              const thumbPath = path.join(
                cacheDir,
                `thumb_${senderID}_${Date.now()}_${i}.jpg`
              );

              const res = await axios.get(r.thumbnail, {
                responseType: "arraybuffer",
                timeout: 10000
              });

              fs.writeFileSync(thumbPath, Buffer.from(res.data));
              return fs.createReadStream(thumbPath);
            } catch {
              return null;
            }
          })
        );
        attachments = thumbs.filter(Boolean);
      }

      results.forEach((r, i) => {
        msg += `${i + 1}. ${r.title}\n⏱ ${r.time}\n\n`;
      });

      return api.sendMessage(
        {
          body:
`📌 নাম্বার দিয়ে রিপ্লাই করো:

${msg}`,
          attachment: attachments.length ? attachments : undefined
        },
        threadID,
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            author: senderID,
            results,
            menuMsgID: info.messageID
          });
        },
        messageID
      );

    } catch (e) {
      return api.sendMessage(`❌ API সমস্যা: ${e.message}`, threadID, messageID);
    }
  },

  onReply: async function ({ event, api, Reply }) {
    const { results, author, menuMsgID } = Reply;

    if (event.senderID !== author) return;

    const choice = parseInt(event.body);
    if (!choice || choice < 1 || choice > results.length) return;

    const videoID = results[choice - 1].id;

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      // 🧹 DELETE MENU MESSAGE AFTER CHOICE
      try {
        if (menuMsgID) api.unsendMessage(menuMsgID);
      } catch {}

      const data = await fetchWithFallback((base) =>
        `${base}/api/ytb/get?id=${videoID}&type=video`
      );

      const downloadLink = data?.data?.downloadLink;
      const title = data?.data?.title;

      if (!downloadLink) throw new Error("Download link not found");

      const filePath = path.join(__dirname, "cache", `yt_${Date.now()}.mp4`);

      const response = await axios({
        url: downloadLink,
        method: "GET",
        responseType: "stream",
        timeout: 20000
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: `👑𝗢𝗪𝗡Ｅ𝗥 🪄 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑 \n${title}`,
            attachment: fs.createReadStream(filePath)
          },
          event.threadID,
          () => fs.unlinkSync(filePath),
          event.messageID
        );
      });

      writer.on("error", () => {
        api.sendMessage("❌ ডাউনলোড ব্যর্থ হয়েছে", event.threadID);
      });

    } catch (e) {
      api.sendMessage(`❌ সমস্যা: ${e.message}`, event.threadID, event.messageID);
    }
  }
};
