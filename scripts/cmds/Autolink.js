const fs = require("fs");
const { downloadVideo } = require("sagor-video-downloader");

// 🔒 LOCK CONFIG
const AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍"; // নাম পরিবর্তন করলে ফাইল বন্ধ হয়ে যাবে ⚠️
const COMMAND_NAME = "autolink";

module.exports = {
    config: {
        name: COMMAND_NAME,
        version: "1.3",
        author: AUTHOR, 
        countDown: 5,
        role: 0,
        shortDescription: "Auto-download & send videos silently (no messages)",
        category: "media",
    },

    onStart: async function () {
        // 🔒 SECURITY CHECK
        if (
            module.exports.config.author !== AUTHOR ||
            module.exports.config.name !== COMMAND_NAME
        ) {
            throw new Error("⛔ Unauthorized file modification detected!");
        }
    },

    onChat: async function ({ api, event }) {
        // 🔒 SECURITY CHECK (extra protection)
        if (
            module.exports.config.author !== AUTHOR ||
            module.exports.config.name !== COMMAND_NAME
        ) {
            return;
        }

        const threadID = event.threadID;
        const messageID = event.messageID;
        const message = event.body || "";

        const linkMatches = message.match(/(https?:\/\/[^\s]+)/g);
        if (!linkMatches || linkMatches.length === 0) return;

        const uniqueLinks = [...new Set(linkMatches)];

        api.setMessageReaction("💋", messageID, () => {}, true);

        let successCount = 0;
        let failCount = 0;

        for (const url of uniqueLinks) {
            try {
                const { title, filePath } = await downloadVideo(url);
                if (!filePath || !fs.existsSync(filePath)) throw new Error();

                const stats = fs.statSync(filePath);
                const fileSizeInMB = stats.size / (1024 * 1024);

                if (fileSizeInMB > 25) {
                    fs.unlinkSync(filePath);
                    failCount++;
                    continue;
                }

                await api.sendMessage(
                    {
                        body:
`📥 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐃
━━━━━━━━━━━━━━━
🎬 𝐓𝐈𝐓𝐋𝐄 : ${title || "Video File"}
📦 𝐒𝐈𝐙𝐄 : ${fileSizeInMB.toFixed(2)} 𝐌𝐁
━━━━━━━━━━━━━━━
🦋 ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
                        attachment: fs.createReadStream(filePath)
                    },
                    threadID,
                    () => fs.unlinkSync(filePath)
                );

                successCount++;

            } catch {
                failCount++;
            }
        }

        const finalReaction =
            successCount > 0 && failCount === 0 ? "✅" :
            successCount > 0 ? "⚠️" : "❌";

        api.setMessageReaction(finalReaction, messageID, () => {}, true);
    }
};
