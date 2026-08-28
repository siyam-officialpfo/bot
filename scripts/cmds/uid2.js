const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage, registerFont } = require("canvas");


module.exports = {
  config: {
    name: "uid",
    version: "0.0.1",
    author: "MR_FARHAN",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Get user's UID and Stylist Banner"
    },
    longDescription: {
      en: "Generates an advanced Cool style banner with User ID and Avatar."
    },
    category: "info",
    guide: {
      en: "{pn} [mention | reply | leave blank]"
    }
  },


  onStart: async function ({ api, event, args, usersData }) {
    const { threadID, messageID, senderID, type, messageReply, mentions } = event;
    const cachePath = path.join(__dirname, "cache", "uid_card.png");


    // 1. Find Target User ID
    let targetID = senderID;
    if (type === "message_reply") {
      targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (args.length > 0) {
      // Check if argument is a number (UID)
      if (!isNaN(args[0])) {
        targetID = args[0];
      }
      // Note: UID from vanity URL requires extra API calls, skipping for basic stability
    }


    // Send processing message
    const processMsg = await api.sendMessage("-ˋˏ✄━═━═━═", threadID);


    try {
      // 2. Fetch User Data
      const userData = await usersData.get(targetID);
      const name = userData.name || "Unknown User";
      const username = name.toUpperCase();


      // 3. Setup Canvas (1200x500 - High Quality Banner)
      const width = 1200;
      const height = 500;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");


      // --- BACKGROUND DESIGN ---
      
      // Dark Base
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);


      // Sci-Fi Grid Background
      ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
      ctx.lineWidth = 2;
      for (let i = 0; i < width; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 60) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }


      // Neon Glow Accents (Cyberpunk Style)
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#00f260");
      gradient.addColorStop(1, "#0575e6");
      
      // Corner Decorations
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(300, 0);
      ctx.lineTo(250, 50);
      ctx.lineTo(0, 50);
      ctx.fill();


      // Bottom Right Deco
      ctx.beginPath();
      ctx.moveTo(width, height);
      ctx.lineTo(width - 300, height);
      ctx.lineTo(width - 250, height - 50);
      ctx.lineTo(width, height - 50);
      ctx.fill();


      // --- AVATAR HANDLING (Fixes "Profile picture dekhay na") ---
      // We use a high-res public graph token URL or fallback
      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      
      // Download Buffer using Axios (Most reliable method)
      let avatarBuffer;
      try {
        const response = await axios.get(avatarUrl, { responseType: "arraybuffer" });
        avatarBuffer = response.data;
      } catch (e) {
        // Fallback if HD fails
        const fallbackUrl = `https://graph.facebook.com/${targetID}/picture?type=large`;
        const response = await axios.get(fallbackUrl, { responseType: "arraybuffer" });
        avatarBuffer = response.data;
      }
      
      const avatarImg = await loadImage(avatarBuffer);


      // Hexagon Avatar Frame
      const centerX = 250;
      const centerY = 250;
      const hexSize = 160;


      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(centerX + hexSize * Math.cos(i * 2 * Math.PI / 6), centerY + hexSize * Math.sin(i * 2 * Math.PI / 6));
      }
      ctx.closePath();
      ctx.lineWidth = 10;
      ctx.strokeStyle = "#00ffff"; // Cyan Border
      ctx.stroke();
      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 30;
      ctx.stroke(); // Double stroke for glow
      ctx.shadowBlur = 0;
      
      // Clip image inside Hexagon
      ctx.clip(); 
      ctx.drawImage(avatarImg, centerX - hexSize, centerY - hexSize, hexSize * 2, hexSize * 2);
      ctx.restore();


      // --- TEXT & DATA ---


      // Name
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 60px Arial"; // Try sans-serif if font file missing
      ctx.shadowColor = "#000000";
      ctx.shadowBlur = 10;
      ctx.fillText(username, 480, 200);


      // UID Label
      ctx.fillStyle = "#00ffff";
      ctx.font = "bold 35px Courier New";
      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 15;
      ctx.fillText(`UID: ${targetID}`, 480, 270);


      // System Text
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "25px Courier New";
      ctx.shadowBlur = 0;
      ctx.fillText("/// IDENTITY VERIFIED /// ", 480, 330);
      ctx.fillText("⚡ POWERED BY: 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍", 480, 370);


      // Decorative Bar Code Lines
      ctx.fillStyle = "#ffffff";
      for(let k=0; k<20; k++) {
          let w = Math.random() * 10 + 2;
          ctx.fillRect(480 + (k*20), 400, w, 20);
      }


      // --- SAVE & SEND ---
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(cachePath, buffer);


      // Unsend processing message
      api.unsendMessage(processMsg.messageID);


      // Send Result
      return api.sendMessage({
        body: ` UID: ${targetID}`,
        attachment: fs.createReadStream(cachePath)
      }, threadID, () => fs.unlinkSync(cachePath), messageID);


    } catch (error) {
      console.error(error);
      api.unsendMessage(processMsg.messageID);
      return api.sendMessage("❌ Error generating image. details: " + error.message, threadID, messageID);
    }
  }
};
