const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const LOCKED_AUTHOR = "SIYAM-HASAN";

function cleanText(text) {
	if (!text) return "";
	return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

module.exports = {
	config: {
		name: "rank",
		version: "6.0",
		author: LOCKED_AUTHOR,
		countDown: 5,
		role: 0,
		description: {
			en: "Generate dynamic graphic card for user rank and level"
		},
		category: "fun"
	},

	onStart: async function ({ api, event, message, usersData }) {
		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
			try {
				fs.writeFileSync(__filename, fs.readFileSync(__filename, "utf8"));
			} catch (e) {}
		}

		try {
			const targetID = event.senderID;
			const userData = await usersData.get(targetID) || {};
			const rawName = userData.name || "User";
			const userName = cleanText(rawName);

			const xp = userData.exp || 1250;
			const level = Math.floor(Math.sqrt(xp) * 0.1) || 1;
			const nextLevelXp = Math.pow((level + 1) / 0.1, 2);
			const currentLevelXp = Math.pow(level / 0.1, 2);
			
			const progressPct = Math.min(100, Math.max(5, Math.floor(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100))) / 100;

			const avatarLink = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

			const width = 880;
			const height = 480;
			const canvas = createCanvas(width, height);
			const ctx = canvas.getContext("2d");

			const bgGradient = ctx.createLinearGradient(0, 0, width, height);
			bgGradient.addColorStop(0, "#050515");
			bgGradient.addColorStop(0.5, "#100b2b");
			bgGradient.addColorStop(1, "#1a0033");
			ctx.fillStyle = bgGradient;
			ctx.fillRect(0, 0, width, height);

			ctx.strokeStyle = "#00f5d4";
			ctx.shadowColor = "#00f5d4";
			ctx.shadowBlur = 18;
			ctx.lineWidth = 5;
			ctx.strokeRect(22, 22, width - 44, height - 44);

			ctx.shadowBlur = 0;

			ctx.fillStyle = "#ffee32";
			ctx.shadowColor = "#ffee32";
			ctx.shadowBlur = 12;
			ctx.font = "bold 32px sans-serif";
			ctx.textAlign = "center";
			ctx.fillText("USER LEVEL CARD", width / 2, 65);

			ctx.shadowBlur = 0;
			ctx.fillStyle = "#ff007f";
			ctx.font = "bold 16px sans-serif";
			ctx.fillText("OWNER: " + LOCKED_AUTHOR, width / 2, 95);

			ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(50, 115);
			ctx.lineTo(width - 50, 115);
			ctx.stroke();

			const avatarSize = 160;
			const avatarX = 65;
			const avatarY = 150;

			try {
				const avatarImg = await loadImage(avatarLink);
				ctx.save();
				ctx.beginPath();
				ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
				ctx.closePath();
				ctx.clip();
				ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
				ctx.restore();

				ctx.strokeStyle = "#ff007f";
				ctx.shadowColor = "#ff007f";
				ctx.shadowBlur = 15;
				ctx.lineWidth = 4;
				ctx.beginPath();
				ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
				ctx.stroke();
				ctx.shadowBlur = 0;
			} catch (e) {
				ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
				ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
			}

			const startX = 260;

			ctx.textAlign = "left";
			ctx.fillStyle = "#ffffff";
			ctx.font = "bold 28px sans-serif";
			ctx.fillText(userName, startX, 185);

			ctx.fillStyle = "#00f5d4";
			ctx.font = "bold 20px sans-serif";
			ctx.fillText("CURRENT LEVEL: " + level, startX, 225);

			ctx.fillStyle = "#ffee32";
			ctx.font = "bold 18px sans-serif";
			ctx.fillText(`TOTAL XP: ${xp}`, startX, 260);

			const barX = startX;
			const barY = 285;
			const barWidth = 550;
			const barHeight = 25;

			ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
			ctx.fillRect(barX, barY, barWidth, barHeight);

			ctx.fillStyle = "#ff007f";
			ctx.shadowColor = "#ff007f";
			ctx.shadowBlur = 8;
			ctx.fillRect(barX, barY, barWidth * progressPct, barHeight);

			ctx.shadowBlur = 0;
			ctx.strokeStyle = "#ffffff";
			ctx.lineWidth = 1;
			ctx.strokeRect(barX, barY, barWidth, barHeight);

			ctx.fillStyle = "#ffffff";
			ctx.font = "bold 14px sans-serif";
			ctx.textAlign = "center";
			ctx.fillText(`${Math.floor(progressPct * 100)}% COMPLETED`, barX + barWidth / 2, barY + 18);

			ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(50, 395);
			ctx.lineTo(width - 50, 395);
			ctx.stroke();

			ctx.textAlign = "center";
			ctx.fillStyle = "#00f5d4";
			ctx.font = "bold 18px sans-serif";
			ctx.fillText("NIJHUM CHATBOT SYSTEM MONITOR", width / 2, 435);

			const cachePath = path.join(__dirname, "cache", `rankup_${targetID}.png`);
			fs.ensureDirSync(path.join(__dirname, "cache"));
			const buffer = canvas.toBuffer("image/png");
			fs.writeFileSync(cachePath, buffer);

			return message.reply(
				{ attachment: fs.createReadStream(cachePath) },
				() => fs.unlinkSync(cachePath)
			);

		} catch (err) {
			return message.reply("Failed to generate level card.");
		}
	}
};ay it will be a `gradient` color
	 * @returns {RankCard}
	 * @example
	 * 	.setSubColor("rgba(255, 255, 255, 0.5)")
	 * 	.setSubColor("#474747")
	 * 	.setSubColor("rgb(255, 255, 255)")
	 * 	.setSubColor("https://example.com/image.png")
	 */
	setSubColor(sub_color) {
		if (typeof sub_color !== "string" && !Array.isArray(sub_color))
			throw new Error("Sub color must be a string or array");
		checkFormatColor(sub_color);
		this.sub_color = sub_color;
		return this;
	}

	/**
	 * @param {string|string[]} exp_color
	 * @description Color of the exp bar is a string or array that can be a `hex color`, `rgb` or `rgba`. If it's an array it will be a `gradient` color
	 * @returns {RankCard}
	 * @example
	 * 	.setExpColor("#474747")
	 * 	.setExpColor("rgb(255, 255, 255)")
	 * 	.setExpColor("rgba(255, 255, 255, 0.5)")
	 */
	setExpColor(exp_color) {
		if (typeof exp_color !== "string" && !Array.isArray(exp_color))
			throw new Error("Exp color must be a string or array");
		checkFormatColor(exp_color);
		this.exp_color = exp_color;
		return this;
	}

	/**
	 * @param {string|string[]} expNextLevel_color
	 * @description Color of the exp bar next level is a string or array that can be a `hex color`, `rgb` or `rgba`. If it's an array it will be a `gradient` color
	 * @returns {RankCard}
	 * @example
	 * 	.setExpBarColor("#474747")
	 * 	.setExpBarColor("rgb(255, 255, 255)")
	 * 	.setExpBarColor("rgba(255, 255, 255, 0.5)")
	 */
	setExpBarColor(expNextLevel_color) {
		if (typeof expNextLevel_color !== "string" && !Array.isArray(expNextLevel_color))
			throw new Error("Exp next level color must be a string");
		checkFormatColor(expNextLevel_color);
		this.expNextLevel_color = expNextLevel_color;
		return this;
	}

	/**
	 * @param {string|string[]} text_color
	 * @description Color of the all text is a string or array that can be a `hex color`, `rgb` or `rgba`. If it's an array it will be a `gradient` color
	 * @returns {RankCard}
	 * @example
	 * 	.setTextColor("#474747")
	 * 	.setTextColor("rgb(255, 255, 255)")
	 * 	.setTextColor("rgba(255, 255, 255, 0.5)")
	 */
	setTextColor(text_color) {
		if (typeof text_color !== "string" && !Array.isArray(text_color))
			throw new Error("Text color must be a string or an array of string");
		checkFormatColor(text_color, false);
		this.text_color = text_color;
		return this;
	}

	/**
	 * @param {string|string[]} name_color
	 * @description Color of the name is a string or array that can be a `hex color`, `rgb` or `rgba`. If it's an array it will be a `gradient` color
	 * @returns {RankCard}
	 * @example
	 * 	.setNameColor("#474747")
	 * 	.setNameColor("rgb(255, 255, 255)")
	 * 	.setNameColor("rgba(255, 255, 255, 0.5)")
	 * 	.setNameColor(["#474747", "#474747"])
	 * 	.setNameColor(['rgb(133, 255, 189)', 'rgb(255, 251, 125)'])
	 */
	setNameColor(name_color) {
		if (typeof name_color !== "string" && !Array.isArray(name_color))
			throw new Error("Name color must be a string or an array of string");
		checkFormatColor(name_color, false);
		this.name_color = name_color;
		return this;
	}

	/**
	 * @param {string|string[]} level_color
	 * @description Color of the level text is a string or array that can be a `hex color`, `rgb` or `rgba`. If it's an array it will be a `gradient` color
	 * @returns {RankCard}
	 * @example
	 * 	.setLevelColor("#474747")
	 * 	.setLevelColor("rgb(255, 255, 255)")
	 * 	.setLevelColor("rgba(255, 255, 255, 0.5)")
	 * 	.setLevelColor(["#474747", "#474747"])
	 * 	.setLevelColor(['rgb(133, 255, 189)', 'rgb(255, 251, 125)'])
	 */
	setLevelColor(level_color) {
		if (typeof level_color !== "string" && !Array.isArray(level_color))
			throw new Error("Level color must be a string or an array of string");
		checkFormatColor(level_color, false);
		this.level_color = level_color;
		return this;
	}

	/**
	 * @param {string|string[]} exp_text_color
	 * @description Color of the exp text is a string or array that can be a `hex color`, `rgb` or `rgba`. If it's an array it will be a `gradient` color
	 * @returns {RankCard}
	 * @example
	 * 	.setExpTextColor("#474747")
	 * 	.setExpTextColor("rgb(255, 255, 255)")
	 * 	.setExpTextColor("rgba(255, 255, 255, 0.5)")
	 * 	.setExpTextColor(["#474747", "#474747"])
	 * 	.setExpTextColor(['rgb(133, 255, 189)', 'rgb(255, 251, 125)'])
	 * 
	 */
	setExpTextColor(exp_text_color) {
		if (typeof exp_text_color !== "string" && !Array.isArray(exp_text_color))
			throw new Error("Exp text color must be a string or an array of string");
		checkFormatColor(exp_text_color, false);
		this.exp_text_color = exp_text_color;
		return this;
	}

	/**
	 * @param {string|string[]} rank_color
	 * @description Color of the rank is a string or array that can be a `hex color`, `rgb` or `rgba`. If it's an array it will be a `gradient` color
	 * @returns {RankCard}
	 */
	setRankColor(rank_color) {
		if (typeof rank_color !== "string" && !Array.isArray(rank_color))
			throw new Error("Rank color must be a string or an array of string");
		checkFormatColor(rank_color, false);
		this.rank_color = rank_color;
		return this;
	}


	/**
	 * @param {string|string[]} line_color
	 * @description Color of the line is a string or array that can be a `hex color`, `rgb`, `rgba` or url of image. If it's an array it will be a `gradient` color
	 * @returns {RankCard}
	 * @example 
	 * 	.setLineColor("#474747")
	 * 	.setLineColor("rgb(255, 255, 255)")
	 * 	.setLineColor("rgba(255, 255, 255, 0.5)")
	 * 	.setLineColor(['#00DBDE', '#FC00FF'])
	 * 	.setLineColor(['rgb(133, 255, 189)', 'rgb(255, 251, 125)'])
	 * 	.setLineColor(['rgba(133, 255, 189, 0.5)', 'rgba(255, 251, 125, 0.5)'])
	 */
	setLineColor(line_color) {
		if (typeof line_color !== "string" && !Array.isArray(line_color))
			throw new Error("Line color must be a string or an array of string");
		this.line_color = line_color;
		return this;
	}

	/**
	 * @param {number} exp
	 * @description Exp of the user
	 * @returns {RankCard}
	 */
	setExp(exp) {
		this.exp = exp;
		return this;
	}

	/**
	 * @param {number} expNextLevel
	 * @description Exp next level of the user
	 * @returns {RankCard}
	 */
	setExpNextLevel(expNextLevel) {
		this.expNextLevel = expNextLevel;
		return this;
	}

	/**
	 * @param {number} level
	 * @description Level of the user
	 * @returns {RankCard}
	 */
	setLevel(level) {
		this.level = level;
		return this;
	}

	/**
	 * @param {string} rank
	 * @description Rank of the user
	 * @returns {RankCard}
	 * @example
	 * 	.setRank("#1/100")
	 */
	setRank(rank) {
		this.rank = rank;
		return this;
	}

	/**
	 * @param {string} name
	 * @description Name of the user
	 * @returns {RankCard}
	 */
	setName(name) {
		this.name = name;
		return this;
	}

	/**
	 * @param {string} avatar
	 * @description url or path of the avatar
	 * @returns {RankCard}
	 */
	setAvatar(avatar) {
		this.avatar = avatar;
		return this;
	}


	async buildCard() {
		let {
			widthCard,
			heightCard
		} = this;
		const {
			main_color,
			sub_color,
			alpha_subcard,
			exp_color,
			expNextLevel_color,
			text_color,
			name_color,
			level_color,
			rank_color,
			line_color,
			exp_text_color,
			exp,
			expNextLevel,
			name,
			level,
			rank,
			avatar
		} = this;

		widthCard = Number(widthCard);
		heightCard = Number(heightCard);

		const canvas = Canvas.createCanvas(widthCard, heightCard);
		const ctx = canvas.getContext("2d");

		/*
			+-----------------------+
			|     DRAW SUBCARD      |	
			+-----------------------+
		*/

		const alignRim = 3 * percentage(widthCard);
		const Alpha = parseFloat(alpha_subcard || 0);

		ctx.globalAlpha = Alpha;
		await checkColorOrImageAndDraw(alignRim, alignRim, widthCard - alignRim * 2, heightCard - alignRim * 2, ctx, sub_color, 20, alpha_subcard);
		ctx.globalAlpha = 1;

		ctx.globalCompositeOperation = "destination-out";

		const xyAvatar = heightCard / 2;
		const resizeAvatar = 60 * percentage(heightCard);

		// Kẽ đường ngang ở giữa
		// Draw a horizontal line in the middle
		const widthLineBetween = 58 * percentage(widthCard);
		const heightLineBetween = 2 * percentage(heightCard);

		const angleLineCenter = 40;
		const edge = heightCard / 2 * Math.tan(angleLineCenter * Math.PI / 180);

		if (line_color) {
			if (!isUrl(line_color)) {
				ctx.fillStyle = ctx.strokeStyle = checkGradientColor(ctx,
					Array.isArray(line_color) ? line_color : [line_color],
					xyAvatar - resizeAvatar / 2 - heightLineBetween,
					0,
					xyAvatar + resizeAvatar / 2 + widthLineBetween + edge,
					0
				);
				ctx.globalCompositeOperation = "source-over";
			}
			else {
				ctx.save();
				const img = Canvas.loadImage(line_color);
				ctx.globalCompositeOperation = "source-over";

				ctx.beginPath();
				ctx.arc(xyAvatar, xyAvatar, resizeAvatar / 2 + heightLineBetween, 0, 2 * Math.PI);
				ctx.fill();

				ctx.rect(xyAvatar + resizeAvatar / 2, heightCard / 2 - heightLineBetween / 2, widthLineBetween, heightLineBetween);
				ctx.fill();

				ctx.translate(xyAvatar + resizeAvatar / 2 + widthLineBetween + edge, 0);
				ctx.rotate(angleLineCenter * Math.PI / 180);
				ctx.rect(0, 0, heightLineBetween, 1000);
				ctx.fill();
				ctx.rotate(-angleLineCenter * Math.PI / 180);
				ctx.translate(-xyAvatar - resizeAvatar / 2 - widthLineBetween - edge, 0);

				ctx.clip();
				ctx.drawImage(await img, 0, 0, widthCard, heightCard);
				ctx.restore();
			}
		}
		ctx.beginPath();
		if (!isUrl(line_color))
			ctx.rect(xyAvatar + resizeAvatar / 2, heightCard / 2 - heightLineBetween / 2, widthLineBetween, heightLineBetween);
		ctx.fill();

		// Kẽ đường chéo ở cuối
		// Draw a slant at the end
		ctx.beginPath();
		if (!isUrl(line_color)) {
			ctx.moveTo(xyAvatar + resizeAvatar / 2 + widthLineBetween + edge, 0);
			ctx.lineTo(xyAvatar + resizeAvatar / 2 + widthLineBetween - edge, heightCard);
			ctx.lineWidth = heightLineBetween;
			ctx.stroke();
		}

		// Xóa nền vị trí đặt avatar
		// Remove background of avatar placement
		ctx.beginPath();
		if (!isUrl(line_color))
			ctx.arc(xyAvatar, xyAvatar, resizeAvatar / 2 + heightLineBetween, 0, 2 * Math.PI);
		ctx.fill();
		ctx.globalCompositeOperation = "destination-out";

		// Xóa xung quanh sub card
		// Remove around sub card
		ctx.fillRect(0, 0, widthCard, alignRim);
		ctx.fillRect(0, heightCard - alignRim, widthCard, alignRim);

		// Xóa nền tại vị trí đặt thanh Exp
		// Remove the background at the location where the Exp bar is located
		const radius = 6 * percentage(heightCard);
		const xStartExp = (25 + 1.5) * percentage(widthCard),
			yStartExp = 67 * percentage(heightCard),
			widthExp = 40.5 * percentage(widthCard),
			heightExp = radius * 2;
		ctx.globalCompositeOperation = "source-over";
		centerImage(ctx, await Canvas.loadImage(avatar), xyAvatar, xyAvatar, resizeAvatar, resizeAvatar);

		// Vẽ thanh Exp
		// Draw Exp bar
		if (!isUrl(expNextLevel_color)) {
			ctx.beginPath();
			ctx.fillStyle = checkGradientColor(ctx, expNextLevel_color, xStartExp, yStartExp, xStartExp + widthExp, yStartExp);
			ctx.arc(xStartExp, yStartExp + radius, radius, 1.5 * Math.PI, 0.5 * Math.PI, true);
			ctx.fill();
			ctx.fillRect(xStartExp, yStartExp, widthExp, heightExp);
			ctx.arc(xStartExp + widthExp, yStartExp + radius, radius, 1.5 * Math.PI, 0.5 * Math.PI, false);
			ctx.fill();
		}
		else {
			ctx.save();
			ctx.beginPath();

			ctx.moveTo(xStartExp, yStartExp);
			ctx.lineTo(xStartExp + widthExp, yStartExp);
			ctx.arcTo(xStartExp + widthExp + radius, yStartExp, xStartExp + widthExp + radius, yStartExp + radius, radius);
			ctx.lineTo(xStartExp + widthExp + radius, yStartExp + heightExp - radius);
			ctx.arcTo(xStartExp + widthExp + radius, yStartExp + heightExp, xStartExp + widthExp, yStartExp + heightExp, radius);
			ctx.lineTo(xStartExp, yStartExp + heightExp);
			ctx.arcTo(xStartExp, yStartExp + heightExp, xStartExp - radius, yStartExp + heightExp - radius, radius);
			ctx.lineTo(xStartExp - radius, yStartExp + radius);
			ctx.arcTo(xStartExp, yStartExp, xStartExp, yStartExp, radius);

			ctx.closePath();
			ctx.clip();

			ctx.drawImage(await Canvas.loadImage(expNextLevel_color), xStartExp, yStartExp, widthExp + radius, heightExp);
			ctx.restore();
		}


		// Exp hiện tại
		// Current Exp
		const widthExpCurrent = (100 / expNextLevel * exp) * percentage(widthExp);
		if (!isUrl(exp_color)) {
			ctx.fillStyle = checkGradientColor(ctx, exp_color, xStartExp, yStartExp, xStartExp + widthExp, yStartExp);
			ctx.beginPath();
			ctx.arc(xStartExp, yStartExp + radius, radius, 1.5 * Math.PI, 0.5 * Math.PI, true);
			ctx.fill();

			ctx.fillRect(xStartExp, yStartExp, widthExpCurrent, heightExp);

			ctx.beginPath();
			ctx.arc(xStartExp + widthExpCurrent - 1, yStartExp + radius, radius, 1.5 * Math.PI, 0.5 * Math.PI);
			ctx.fill();
		}
		else {
			const imgExp = await Canvas.loadImage(exp_color);
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(xStartExp, yStartExp);
			ctx.lineTo(xStartExp + widthExpCurrent, yStartExp);
			ctx.arc(xStartExp + widthExpCurrent, yStartExp + radius, radius, 1.5 * Math.PI, 0.5 * Math.PI, false);
			ctx.lineTo(xStartExp + widthExpCurrent + radius, yStartExp + heightExp - radius);
			ctx.arcTo(xStartExp + widthExpCurrent + radius, yStartExp + heightExp, xStartExp + widthExpCurrent, yStartExp + heightExp, radius);
			ctx.lineTo(xStartExp, yStartExp + heightExp);
			ctx.arc(xStartExp, yStartExp + radius, radius, 1.5 * Math.PI, 0.5 * Math.PI, true);
			ctx.lineTo(xStartExp - radius, yStartExp + radius);
			ctx.arc(xStartExp, yStartExp + radius, radius, 1.5 * Math.PI, 0.5 * Math.PI, true);
			ctx.closePath();
			ctx.clip();
			ctx.drawImage(imgExp, xStartExp - radius, yStartExp, widthExp + radius * 2, heightExp);
			ctx.restore();
		}

		const maxSizeFont_Name = 4 * percentage(widthCard) + this.textSize;
		const maxSizeFont_Exp = 2 * percentage(widthCard) + this.textSize;
		const maxSizeFont_Level = 3.25 * percentage(widthCard) + this.textSize;
		const maxSizeFont_Rank = 4 * percentage(widthCard) + this.textSize;

		ctx.textAlign = "end";

		// Vẽ chữ Rank
		// Draw rank text
		ctx.font = autoSizeFont(18.4 * percentage(widthCard), maxSizeFont_Rank, rank, ctx, this.fontName);
		const metricsRank = ctx.measureText(rank);
		ctx.fillStyle = checkGradientColor(ctx, rank_color || text_color,
			94 * percentage(widthCard) - metricsRank.width,
			76 * percentage(heightCard) + metricsRank.emHeightDescent,
			94 * percentage(widthCard),
			76 * percentage(heightCard) - metricsRank.actualBoundingBoxAscent
		);
		ctx.fillText(rank, 94 * percentage(widthCard), 76 * percentage(heightCard));

		// Draw Level text
		const textLevel = `Lv ${level}`;
		ctx.font = autoSizeFont(9.8 * percentage(widthCard), maxSizeFont_Level, textLevel, ctx, this.fontName);
		const metricsLevel = ctx.measureText(textLevel);
		const xStartLevel = 94 * percentage(widthCard);
		const yStartLevel = 32 * percentage(heightCard);
		ctx.fillStyle = checkGradientColor(ctx, level_color || text_color,
			xStartLevel - ctx.measureText(textLevel).width,
			yStartLevel + metricsLevel.emHeightDescent,
			xStartLevel,
			yStartLevel - metricsLevel.actualBoundingBoxAscent
		);
		ctx.fillText(textLevel, xStartLevel, yStartLevel);
		ctx.font = autoSizeFont(52.1 * percentage(widthCard), maxSizeFont_Name, name, ctx, this.fontName);
		ctx.textAlign = "center";

		// Draw Name
		const metricsName = ctx.measureText(name);
		ctx.fillStyle = checkGradientColor(ctx, name_color || text_color,
			47.5 * percentage(widthCard) - metricsName.width / 2,
			40 * percentage(heightCard) + metricsName.emHeightDescent,
			47.5 * percentage(widthCard) + metricsName.width / 2,
			40 * percentage(heightCard) - metricsName.actualBoundingBoxAscent
		);
		ctx.fillText(name, 47.5 * percentage(widthCard), 40 * percentage(heightCard));

		// Draw Exp text
		const textExp = `Exp ${exp}/${expNextLevel}`;
		ctx.font = autoSizeFont(49 * percentage(widthCard), maxSizeFont_Exp, textExp, ctx, this.fontName);
		const metricsExp = ctx.measureText(textExp);
		ctx.fillStyle = checkGradientColor(ctx, exp_text_color || text_color,
			47.5 * percentage(widthCard) - metricsExp.width / 2,
			61.4 * percentage(heightCard) + metricsExp.emHeightDescent,
			47.5 * percentage(widthCard) + metricsExp.width / 2,
			61.4 * percentage(heightCard) - metricsExp.actualBoundingBoxAscent
		);
		ctx.fillText(textExp, 47.5 * percentage(widthCard), 61.4 * percentage(heightCard));


		/*
			+------------------------------------+
			|     DRAW MAINCARD (BACKGROUND)     |	
			+------------------------------------+
		*/
		ctx.globalCompositeOperation = "destination-over";
		if (main_color.match?.(/^https?:\/\//) || Buffer.isBuffer(main_color)) {
			ctx.beginPath();
			ctx.moveTo(radius, 0);
			ctx.lineTo(widthCard - radius, 0);
			ctx.quadraticCurveTo(widthCard, 0, widthCard, radius);
			ctx.lineTo(widthCard, heightCard - radius);
			ctx.quadraticCurveTo(widthCard, heightCard, widthCard - radius, heightCard);
			ctx.lineTo(radius, heightCard);
			ctx.quadraticCurveTo(0, heightCard, 0, heightCard - radius);
			ctx.lineTo(0, radius);
			ctx.quadraticCurveTo(0, 0, radius, 0);
			ctx.closePath();
			ctx.clip();
			ctx.drawImage(await Canvas.loadImage(main_color), 0, 0, widthCard, heightCard);
		}
		else {
			ctx.fillStyle = checkGradientColor(ctx, main_color, 0, 0, widthCard, heightCard);
			drawSquareRounded(ctx, 0, 0, widthCard, heightCard, radius, main_color);
		}
		// return canvas.toBuffer();
		// return stream
		return canvas.createPNGStream();
	}
}

async function checkColorOrImageAndDraw(xStart, yStart, width, height, ctx, colorOrImage, r) {
	if (!colorOrImage.match?.(/^https?:\/\//)) {
		if (Array.isArray(colorOrImage)) {
			const gradient = ctx.createLinearGradient(xStart, yStart, xStart + width, yStart + height);
			colorOrImage.forEach((color, index) => {
				gradient.addColorStop(index / (colorOrImage.length - 1), color);
			});
			ctx.fillStyle = gradient;
		}
		drawSquareRounded(ctx, xStart, yStart, width, height, r, colorOrImage);
	}
	else {
		const imageLoad = await Canvas.loadImage(colorOrImage);
		ctx.save();
		roundedImage(xStart, yStart, width, height, r, ctx);
		ctx.clip();
		ctx.drawImage(imageLoad, xStart, yStart, width, height);
		ctx.restore();
	}
}

function drawSquareRounded(ctx, x, y, w, h, r, color, defaultGlobalCompositeOperation, notChangeColor) {
	ctx.save();
	if (defaultGlobalCompositeOperation)
		ctx.globalCompositeOperation = "source-over";
	if (w < 2 * r)
		r = w / 2;
	if (h < 2 * r)
		r = h / 2;
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
	if (!notChangeColor)
		ctx.fillStyle = color;
	ctx.fill();
	ctx.restore();
}

function roundedImage(x, y, width, height, radius, ctx) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
}

function centerImage(ctx, img, xCenter, yCenter, w, h) {
	const x = xCenter - w / 2;
	const y = yCenter - h / 2;
	ctx.save();
	ctx.beginPath();
	ctx.arc(xCenter, yCenter, w / 2, 0, 2 * Math.PI);
	ctx.clip();
	ctx.closePath();
	ctx.drawImage(img, x, y, w, h);
	ctx.restore();
}

function autoSizeFont(maxWidthText, maxSizeFont, text, ctx, fontName) {
	let sizeFont = 0;
	// eslint-disable-next-line no-constant-condition
	while (true) {
		sizeFont += 1;
		ctx.font = sizeFont + "px " + fontName;
		const widthText = ctx.measureText(text).width;
		if (widthText > maxWidthText || sizeFont > maxSizeFont) break;
	}
	return sizeFont + "px " + fontName;
}

function checkGradientColor(ctx, color, x1, y1, x2, y2) {
	if (Array.isArray(color)) {
		const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
		color.forEach((c, index) => {
			gradient.addColorStop(index / (color.length - 1), c);
		});
		return gradient;
	}
	else {
		return color;
	}
}

function isUrl(string) {
	try {
		new URL(string);
		return true;
	}
	catch (err) {
		return false;
	}
}

function checkFormatColor(color, enableUrl = true) {
	if (
		!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color) &&
		!/^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/.test(color) &&
		!/^rgba\((\d{1,3}), (\d{1,3}), (\d{1,3}), (\d{1,3})\)$/.test(color) &&
		(enableUrl ? !isUrl(color) : true) &&
		!Array.isArray(color)
	)
		throw new Error(`The color format must be a hex, rgb, rgba ${enableUrl ? ", url image" : ""} or an array of colors`);
}
