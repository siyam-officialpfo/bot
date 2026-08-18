module.exports = {
  config: {
    name: "mg",
    aliases: ["magic", "mg"],
    version: "1.0",
    author: "Denish",
    countDown: 0,
    role: 0,
    shortDescription: "Magic Image Generator",
    longDescription: "Generate AI images using Magic Generator API.",
    category: "ai",
    guide: "{p}mg <prompt>"
  },

  onStart: async function ({ message, args }) {
    const prompt = args.join(" ");
    if (!prompt)
      return message.reply("⚠️ Give me a prompt!");

    try {
      const apiUrl = `https://dens-magic-img.vercel.app/api/generate?prompt=${encodeURIComponent(prompt)}`;

      // Directly send the image without extra messages
      await message.reply({
        attachment: await global.utils.getStreamFromUrl(apiUrl)
      });

    } catch (err) {
      console.error(err);
      message.reply("⚠️ Failed to generate image.");
    }
  }
};
