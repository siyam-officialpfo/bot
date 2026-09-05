const moment = require("moment-timezone");

const AUTHOR = "সিয়াম"; // 🔒 locked author

module.exports = {
  config: {
    name: "age",
    aliases: ["myage", "বয়স"],
    version: "11.0",
    author: AUTHOR,
    role: 0,
    category: "utility",
    guide: "age <YYYY | DD/MM/YYYY | D Month YYYY>",
    countDown: 3
  },

  onStart: async function ({ api, event, args }) {
    try {
      // 🔒 AUTHOR LOCK SYSTEM
      if (module.exports.config.author !== AUTHOR) {
        return api.sendMessage(
          "⛔ This file is locked!\nAuthor change detected.",
          event.threadID
        );
      }

      // ইনপুট না দিলে সাহায্যকারী বার্তা
      if (!args.length) {
        return api.sendMessage(
          "⚠️ আপনার জন্মতারিখ সঠিকভাবে লিখুন!\n\nউদাহরণ:\n• age 2007\n• age 01/05/2007\n• age 5 May 2007",
          event.threadID
        );
      }

      let input = args.join(" ").trim();
      let day, month, year;

      const monthMap = {
        jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3,
        apr: 4, april: 4, may: 5, jun: 6, june: 6,
        jul: 7, july: 7, aug: 8, august: 8,
        sep: 9, september: 9, oct: 10, october: 10,
        nov: 11, november: 11, dec: 12, december: 12
      };

      // ফরম্যাট চেক করা
      if (/^\d{4}$/.test(input)) {
        day = 1; month = 1; year = Number(input);
      } else if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(input)) {
        const p = input.split("/");
        day = +p[0];
        month = +p[1];
        year = +p[2];
        if (year < 100) year += 2000;
      } else if (/^\d{1,2}\s+[a-zA-Z]{3,9}\s+\d{4}$/.test(input)) {
        const p = input.split(" ");
        day = +p[0];
        month = monthMap[p[1].toLowerCase()];
        year = +p[2];
      } else if (/^\d{1,2}\/[a-zA-Z]{3,9}\/\d{4}$/.test(input)) {
        const p = input.split("/");
        day = +p[0];
        month = monthMap[p[1].toLowerCase()];
        year = +p[2];
      } else {
        return api.sendMessage(
          "❌ তারিখের ফরম্যাট সঠিক নয়!\n\n✔ সঠিক ব্যবহার:\n• age 2007\n• age 01/05/2007\n• age 3 May 2007",
          event.threadID
        );
      }

      if (!day || !month || !year) {
        return api.sendMessage("❌ সঠিক তারিখ সনাক্ত করা যায়নি!", event.threadID);
      }

      const birth = moment.tz(
        `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        "YYYY-MM-DD",
        "Asia/Dhaka"
      );

      if (!birth.isValid()) {
        return api.sendMessage("❌ অকার্যকর তারিখ প্রদান করা হয়েছে!", event.threadID);
      }

      const now = moment.tz("Asia/Dhaka");
      if (birth.isAfter(now)) {
        return api.sendMessage("❌ জন্মতারিখ ভবিষ্যতের হতে পারে না!", event.threadID);
      }

      // বয়স হিসাব
      const y = now.diff(birth, 'years');
      birth.add(y, 'years');
      const m = now.diff(birth, 'months');
      birth.add(m, 'months');
      const dy = now.diff(birth, 'days');

      const originalBirth = moment.tz(
        `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        "YYYY-MM-DD",
        "Asia/Dhaka"
      );

      const totalMonths = y * 12 + m;
      const totalDays = Math.floor(now.diff(originalBirth, 'days'));
      const totalHours = Math.floor(now.diff(originalBirth, 'hours'));

      // বারের নাম বাংলায়
      const banglaDays = {
        Sunday: "রবিবার",
        Monday: "সোমবার",
        Tuesday: "মঙ্গলবার",
        Wednesday: "বুধবার",
        Thursday: "বৃহস্পতিবার",
        Friday: "শুক্রবার",
        Saturday: "শনিবার"
      };
      const dayName = banglaDays[originalBirth.format("dddd")] || originalBirth.format("dddd");

      // পরবর্তী জন্মদিন
      let nextBirthday = moment.tz(
        `${now.year()}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        "YYYY-MM-DD",
        "Asia/Dhaka"
      );
      if (now.isAfter(nextBirthday, 'day')) {
        nextBirthday.add(1, 'year');
      }
      const daysToNextBirthday = Math.ceil(nextBirthday.diff(now, 'days', true));

      // সুন্দর ও পরিষ্কার আউটপুট মেসেজ
      const msgText = `» 👑 𝗢𝗪𝗡𝗘𝗥 : 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
───────────────
» 🎂 𝗔𝗚𝗘 𝗥𝗘𝗦𝗨𝗟𝗧
» 📅 জন্মতারিখ : ${day}/${month}/${year} (${dayName})
───────────────
»🎂 𝗕𝗔𝗥𝗧𝗔𝗠𝗔𝗡 𝗕𝗢𝗬𝗢𝗦
» ${y} বছর ${m} মাস ${dy} দিন
───────────────
» 📊 𝗧𝗢𝗧𝗔𝗟
» 📅 ${totalDays.toLocaleString()} দিন
» 🗓️ ${totalMonths.toLocaleString()} মাস
» ⏰ ${totalHours.toLocaleString()} ঘণ্টা
───────────────
🎁 𝗡𝗘𝗫𝗧 𝗕𝗜𝗥𝗧𝗛𝗗𝗔𝗬
» আর ${daysToNextBirthday} দিন বাকি!
───────────────
» 🧚‍♀️ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(msgText, event.threadID);

    } catch (e) {
      console.error(e);
      return api.sendMessage("❌ বয়স গণনা করতে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।", event.t[...]
    }
  }
};
