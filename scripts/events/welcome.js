const {
    createCanvas,
    loadImage
} = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require("axios");

const SPECIAL_THREAD_ID = "1018073844423801";

const backgroundImages = [
    "https://i.imgur.com/XVRFwns.jpeg",
    "https://i.imgur.com/DXXvgjb.png",
    "https://i.imgur.com/LwoDuzZ.jpeg",
    "https://i.imgur.com/mtSrSYh.jpeg",
    "https://i.imgur.com/IVvEBc4.jpeg",
    "https://i.imgur.com/uJcd1bf.jpeg"
];

const botJoinImages = [
    "https://i.imgur.com/y5a5BBP.jpeg",
    "https://i.imgur.com/586Aq55.jpeg"
];

const backgroundCache = new Map();

async function loadBackgroundImage(url) {
    if (backgroundCache.has(url)) return backgroundCache.get(url);
    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });
        const img = await loadImage(Buffer.from(response.data));
        backgroundCache.set(url, img);
        return img;
    } catch (error) {
        console.error("[WELCOME] Failed to load background:", url, error.message);
        return null;
    }
}

async function drawProfileImage(ctx, imageUrl, x, y, size, borderColor) {
    const radius = size / 2;
    try {
        const response = await axios.get(imageUrl, {
            responseType: "arraybuffer",
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });
        const img = await loadImage(Buffer.from(response.data));
        ctx.shadowColor = borderColor;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(x, y, radius + 5, 0, Math.PI * 2);
        ctx.fillStyle = borderColor;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
        ctx.fillStyle = borderColor;
        ctx.fill();
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, x - radius, y - radius, size, size);
        ctx.restore();
        return true;
    } catch (error) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#374151';
        ctx.fill();
        ctx.fillStyle = borderColor;
        ctx.font = `bold ${radius * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('U', x, y);
        return false;
    }
}

async function createWelcomeCard(gcImg, userImg, adderImg, userName, userNumber, threadName, adderName) {
    const width = 1200;
    const height = 700;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const selectedBackground = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    const background = await loadBackgroundImage(selectedBackground);
    if (background) {
        ctx.drawImage(background, 0, 0, width, height);
    } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width, height);
    }
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, width, height);
    await Promise.all([
        drawProfileImage(ctx, gcImg, width / 2, 200, 200, "#ffffff"),
        drawProfileImage(ctx, userImg, 120, height - 100, 150, "#10b981"),
        drawProfileImage(ctx, adderImg, width - 120, 100, 150, "#3b82f6")
    ]);
    ctx.font = 'bold 36px "Segoe UI", Arial';
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(threadName, width / 2, 350);
    const welcomeGradient = ctx.createLinearGradient(
        width / 2 - 180,
        360,
        width / 2 + 180,
        360
    );
    welcomeGradient.addColorStop(0, "#3b82f6");
    welcomeGradient.addColorStop(0.5, "#10b981");
    welcomeGradient.addColorStop(1, "#ec4899");
    ctx.font = 'bold 72px "Segoe UI", Arial';
    ctx.fillStyle = welcomeGradient;
    ctx.fillText("WELCOME", width / 2, 450);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 150, 420);
    ctx.lineTo(width / 2 + 150, 420);
    ctx.stroke();
    ctx.font = 'bold 48px "Segoe UI", Arial';
    ctx.fillStyle = "#10b981";
    ctx.fillText(userName, width / 2, 500);
    ctx.font = 'bold 28px "Segoe UI", Arial';
    ctx.fillStyle = "#e2e8f0";
    ctx.fillText(`Member #${userNumber}`, width / 2, 585);
    ctx.textAlign = "left";
    ctx.fillStyle = "#10b981";
    ctx.font = 'bold 26px "Segoe UI", Arial';
    ctx.fillText(userName, 220, height - 95);
    ctx.textAlign = "right";
    ctx.fillStyle = "#3b82f6";
    ctx.font = 'bold 22px "Segoe UI", Arial';
    ctx.fillText(`Added by: ${adderName}`, width - 220, 105);
    ctx.font = '18px "Segoe UI"';
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillText("©made by azadx69x", width - 10, height - 10);
    return canvas.toBuffer();
}

module.exports = {
    config: {
        name: "welcome",
        version: "2.1",
        author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
        category: "events"
    },
    onStart: async ({ threadsData, event, message, usersData, api }) => {
        if (event.logMessageType !== "log:subscribe") return;
        try {
            const threadID = event.threadID;
            const addedUser = event.logMessageData.addedParticipants[0];
            const addedUserId = addedUser.userFbId;
            const userName = addedUser.fullName;
            const botID = api.getCurrentUserID();
            const threadInfo = await threadsData.get(threadID) || {};
            const threadName = threadInfo.threadName || "Group";
            const memberCount = (threadInfo.members && Array.isArray(threadInfo.members)) ? threadInfo.members.length : (threadInfo.members ? Object.keys(threadInfo.members).length : 1);

            if (addedUserId === botID) {
                try {
                    await api.changeNickname("𓆩[ , ]𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓𓆪", threadID, botID);
                } catch (nicknameError) {
                    console.error("[Welcome] Failed to change bot nickname:", nicknameError);
                }

                let imageStream;
                let botJoinImgPath;
                try {
                    const randomBotImgUrl = botJoinImages[Math.floor(Math.random() * botJoinImages.length)];
                    const imgResponse = await axios.get(randomBotImgUrl, {
                        responseType: "arraybuffer",
                        headers: {
                            "User-Agent": "Mozilla/5.0"
                        }
                    });
                    const tempDir = path.join(__dirname, '..', '..', 'temp');
                    await fs.ensureDir(tempDir);
                    botJoinImgPath = path.join(tempDir, `bot_join_${Date.now()}.jpeg`);
                    fs.writeFileSync(botJoinImgPath, Buffer.from(imgResponse.data));
                    imageStream = fs.createReadStream(botJoinImgPath);
                } catch (imgError) {
                    console.error("[Welcome] Bot image download failed:", imgError.message);
                }

                const msgPayload = {
                    body: `✨ 𝗕𝗢𝗧 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 ✨\n──────────────────\n👋 হ্যালো BOT EXPOSED 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 \n\n🤖 আমি 𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧\n❤️ আমাকে গ্রুপে Add করার জন্য ধন্যবাদ\n\n──────────────────\n📌 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢\n» 👥 𝗠𝗘𝗠𝗕𝗘𝗥𝗦 : ${memberCount}\n» 🤖 𝗣𝗥𝗘𝗙𝗜𝗫 : { , }\n\n──────────────────\n📖 𝗚𝗘𝗧 𝗦𝗧𝗔𝗥𝗧𝗘𝗗\n» /help — সকল কমান্ড দেখুন\n» call আপনার সমস্যা লেখুন\n» 📞 +𝟴𝟴𝟬𝟭𝟴𝟵𝟭𝟯𝟴𝟭𝟱𝟳\n─────────────────\n👑 𝗢𝗪𝗡𝗘𝗥 : 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍\n\n🌸 সবাইকে স্বাগতম`
                };

                if (imageStream) {
                    msgPayload.attachment = imageStream;
                }

                await message.reply(msgPayload);

                if (botJoinImgPath && fs.existsSync(botJoinImgPath)) {
                    setTimeout(() => fs.unlinkSync(botJoinImgPath), 5000);
                }
                return;
            }

            if (String(threadID) === String(SPECIAL_THREAD_ID)) {
                const specialRulesMessage = {
                    body: `📢 Swagatam @${userName}\n\n『░⃟̎̎̎̎̐𝄞𝐅𝐑𝐈𝐄𝐍𝐃𝐒' 𝄟≛⃝𝐕𝐈𝐃𝐄𝐎≛⃝𝄟𝐁𝐎𝐗░⃟̎̎̎̎̐』\n\n          📜 𝐕𝐈𝐃𝐄𝐎 𝐁𝐎𝐗 𝐑𝐔𝐋𝐄𝐒\n\n⚠️ গ্রুপে থাকলে নিচের নিয়মগুলো অবশ্যই মেনে চলতে হবে।\n\n1️⃣ শুধুমাত্র ভিডিও দেওয়া যাবে।\n\n2️⃣ ১৮+ বা অশ্লীল কোনো ভিডিও/কনটেন্ট\nসম্পূর্ণ নিষিদ্ধ।\n\n3️⃣ অপ্রয়োজনীয় মেনশন (@) অথবা\n📢 স্পিকার/ট্যাক্স দেওয়া সম্পূর্ণ নিষিদ্ধ।\n\n4️⃣ ইনবক্সে বিরক্ত করা বা গ্রুপ থেকে\nইনবক্সে ডাকা যাবে না।\n\n5️⃣ গালাগালি, ঝগড়া, অপমানজনক ভাষা ও\nধর্মীয়/রাজনৈতিক বিতর্কের ভিডিও\nসম্পূর্ণ নিষিদ্ধ।\n\n6️⃣ স্প্যাম, ফ্লাড বা একই পোস্ট\nবারবার দেওয়া যাবে না।\n\n7️⃣ অন্য গ্রুপ বা পেজের অযথা\nপ্রচার (Promotion) সম্পূর্ণ নিষিদ্ধ।\n\n8️⃣ একটি ভিডিওতে কমপক্ষে ৫টি রিয়্যাক্ট\nনা হওয়া পর্যন্ত দ্বিতীয় ভিডিও\nদেওয়া সম্পূর্ণ নিষিদ্ধ।\n\n9️⃣ অ্যাডমিন বা মডারেটরের সিদ্ধান্ত\nসবাইকে সম্মান করতে হবে।\n\n🔟 কোনো সমস্যা হলে সরাসরি\nঅ্যাডমিনের সাথে যোগাযোগ করুন।\n\n1️⃣1️⃣ নিয়ম ভঙ্গ করলে সতর্কতা ছাড়াই\nকিক বা রিমুভ করা হবে।\n\n━━━━━━━━━━━━━━━━━━\n\n𝗢𝗪𝗡𝗘𝗥 ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
                    mentions: [{
                        tag: `@${userName}`,
                        id: addedUserId
                    }]
                };
                return await message.reply(specialRulesMessage);
            }

            const adderId = event.author;
            const [userAvatar, adderAvatar, adderName] = await Promise.all([
                usersData.getAvatarUrl(addedUserId),
                usersData.getAvatarUrl(adderId),
                usersData.getName(adderId)
            ]);
            const groupImage = threadInfo.imageSrc || 'https://i.imgur.com/7Qk8k6c.png';
            const tempDir = path.join(__dirname, '..', '..', 'temp');
            await fs.ensureDir(tempDir);

            const imageBuffer = await createWelcomeCard(
                groupImage,
                userAvatar,
                adderAvatar,
                userName,
                memberCount,
                threadName,
                adderName
            );
            const tempPath = path.join(
                tempDir,
                `welcome_${Date.now()}.png`
            );
            fs.writeFileSync(tempPath, imageBuffer);
            await message.reply({
                body: `🌸 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 🌸\n━━━━━━━━━━━━\n🌷 𝐍𝐚𝐦𝐞: ${userName}\n🏷️ 𝐆𝐫𝐨𝐮𝐩: ${threadName}\n🔢 𝐌𝐞𝐦𝐛𝐞𝐫 #${memberCount}\n👤 𝐀𝐝𝐝𝐞𝐝 𝐛𝐲: ${adderName}\n━━━━━━━━━━━━\n𝐄𝐧𝐣𝐨𝐲 𝐲𝐨𝐮𝐫 𝐬𝐭𝐚𝐲! 😊`,
                attachment: fs.createReadStream(tempPath)
            });
            setTimeout(() => {
                if (fs.existsSync(tempPath)) {
                    fs.unlinkSync(tempPath);
                }
            }, 10000);

        } catch (error) {
            console.error("[Welcome error]:", error);
            const addedUser = event.logMessageData.addedParticipants[0];
            await message.send({
                body: `🌸 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 ${addedUser.fullName}! 🌸\n━━━━━━━━━━━━\n🌷 𝐓𝐨 𝐨𝐮𝐫 𝐠𝐫𝐨𝐮𝐩 𝐟𝐚𝐦𝐢𝐥𝐲!\n🌟 𝐖𝐞'𝐫𝐞 𝐞𝐱𝐜𝐢𝐭𝐞𝐝 𝐭𝐨 𝐡𝐚𝐯𝐞 𝐲𝐨𝐮!\n🎊 𝐏𝐥𝐞𝐚𝐬𝐞 𝐢𝐧𝐭𝐫𝐨𝐝𝐮𝐜𝐞 𝐲𝐨𝐮𝐫𝐬𝐞𝐥𝐟!\n━━━━━━━━━━━━\n𝐇𝐚𝐯𝐞 𝐟𝐮𝐧! 😊`
            });
        }
    }
};
