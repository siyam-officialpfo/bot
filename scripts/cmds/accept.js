const fs = require("fs-extra");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
	config: {
		name: "friend",
		aliases: ["fr", "friendreq"],
		version: "2.5",
		author: LOCKED_AUTHOR,
		countDown: 3,
		role: 0,
		shortDescription: "Friend request manager",
		longDescription: "Send, count, batch accept, or remove friends",
		category: "utility",
		guide: "{p}friend [add/count/accept/unfriend]"
	},

	onStart: async function ({ api, message, event, args, usersData, role }) {
		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
			fs.writeFileSync(__filename, fs.readFileSync(__filename, "utf8"));
		}

		const subCommand = args[0]?.toLowerCase();

		// ইউজার টার্গেট নির্ণয় (Mention, Reply, UID বা নিজের ID)
		let targetID;
		if (event.type === "message_reply") {
			targetID = event.messageReply.senderID;
		} else if (Object.keys(event.mentions || {}).length > 0) {
			targetID = Object.keys(event.mentions)[0];
		} else if (args[1] && !isNaN(args[1])) {
			targetID = args[1];
		} else {
			targetID = event.senderID;
		}

		// ১. ফ্রেন্ড রিকোয়েস্ট পাঠানো (সাধারণ ইউজার)
		if (subCommand === "add" || subCommand === "send") {
			try {
				const formAdd = {
					av: api.getCurrentUserID(),
					fb_api_req_friendly_name: "FriendingCometFriendRequestSendMutation",
					fb_api_caller_class: "RelayModern",
					doc_id: "61899120710685",
					variables: JSON.stringify({
						input: {
							friend_requestee_id: targetID,
							source: "profile_button",
							actor_id: api.getCurrentUserID(),
							client_mutation_id: Date.now().toString()
						},
						scale: 3
					})
				};

				const res = await api.httpPost("https://www.facebook.com/api/graphql/", formAdd);
				const data = JSON.parse(res);

				if (data.errors) {
					return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 𝐒𝐄𝐍𝐃
» ⚠️ ফ্রেন্ড রিকোয়েস্ট পাঠানো সম্ভব হয়নি!
» 🆔 ID: ${targetID}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
					);
				}

				const name = await usersData.getName(targetID);
				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ 𝐅𝐑𝐈𝐄𝐍𝐃 𝐑𝐄𝐐𝐔𝐄𝐒𝐓 𝐒𝐄𝐍𝐓!
» 👤 𝐔𝐒𝐄𝐑 : ${name}
» 🆔 𝐈𝐃 : ${targetID}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);

			} catch (err) {
				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐒𝐘𝐒𝐓𝐄𝐌 𝐄𝐑𝐑𝐎𝐑!
» ⚠️ রিকোয়েস্ট পাঠাতে ব্যর্থ হয়েছে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);
			}
		}

		// ২. আনফ্রেন্ড করা (সাধারণ ইউজার)
		else if (subCommand === "unfriend" || subCommand === "remove") {
			try {
				const formUnfriend = {
					av: api.getCurrentUserID(),
					fb_api_req_friendly_name: "FriendingCometUnfriendMutation",
					fb_api_caller_class: "RelayModern",
					doc_id: "6262222270505844",
					variables: JSON.stringify({
						input: {
							unfriended_person_id: targetID,
							actor_id: api.getCurrentUserID(),
							client_mutation_id: Date.now().toString()
						},
						scale: 3
					})
				};

				const res = await api.httpPost("https://www.facebook.com/api/graphql/", formUnfriend);
				const data = JSON.parse(res);

				if (data.errors) {
					return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 𝐔𝐍𝐅𝐑𝐈𝐄𝐍𝐃!
» ⚠️ ইউজারকে আনফ্রেন্ড করা সম্ভব হয়নি।
» 🆔 ID: ${targetID}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
					);
				}

				const name = await usersData.getName(targetID);
				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ 𝐔𝐍𝐅𝐑𝐈𝐄𝐍𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋!
» 👤 𝐔𝐒𝐄𝐑 : ${name}
» 🆔 𝐈𝐃 : ${targetID}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);

			} catch (err) {
				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐒𝐘𝐒𝐓𝐄𝐌 𝐄𝐑𝐑𝐎𝐑!
» ⚠️ আনফ্রেন্ড করতে ব্যর্থ হয়েছে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);
			}
		}

		// ৩. পেন্ডিং ফ্রেন্ড রিকোয়েস্টের সংখ্যা দেখা (শুধু বট এডমিন)
		else if (subCommand === "count" || subCommand === "list") {
			if (role < 1) {
				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐀𝐂𝐂𝐄𝐒𝐒 𝐃𝐄𝐍𝐈𝐄𝐃!
» ⚠️ এই অপশনটি শুধুমাত্র বট এডমিন ব্যবহার করতে পারবেন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);
			}

			try {
				const formList = {
					av: api.getCurrentUserID(),
					fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
					fb_api_caller_class: "RelayModern",
					doc_id: "61568411310748",
					variables: JSON.stringify({ input: { scale: 3 } })
				};

				const res = await api.httpPost("https://www.facebook.com/api/graphql/", formList);
				const list = JSON.parse(res).data?.viewer?.friending_possibilities?.edges || [];

				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📥 𝐏𝐄𝐍𝐃𝐈𝐍𝐆 𝐑𝐄𝐐𝐔𝐄𝐒𝐓𝐒
» 📊 বটের আইডিতে ঝুলন্ত রিকোয়েস্ট: ${list.length} টি
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);

			} catch (err) {
				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 𝐅𝐄𝐓𝐂𝐇!
» ⚠️ রিকোয়েস্ট সংখ্যা আনা সম্ভব হয়নি।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);
			}
		}

		// ৪. একসাথে ১০টি রিকোয়েস্ট একসেপ্ট করা (শুধু বট এডমিন)
		else if (subCommand === "accept") {
			if (role < 1) {
				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐀𝐂𝐂𝐄𝐒𝐒 𝐃𝐄𝐍𝐈𝐄𝐃!
» ⚠️ এই অপশনটি শুধুমাত্র বট এডমিন ব্যবহার করতে পারবেন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);
			}

			try {
				const formList = {
					av: api.getCurrentUserID(),
					fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
					fb_api_caller_class: "RelayModern",
					doc_id: "61568411310748",
					variables: JSON.stringify({ input: { scale: 3 } })
				};

				const res = await api.httpPost("https://www.facebook.com/api/graphql/", formList);
				const list = JSON.parse(res).data?.viewer?.friending_possibilities?.edges || [];

				if (list.length === 0) {
					return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ কোনো পেন্ডিং ফ্রেন্ড রিকোয়েস্ট নেই!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
					);
				}

				const batch = list.slice(0, 10);
				let successCount = 0;
				let failCount = 0;

				for (const item of batch) {
					const reqID = item.node.id;
					const formAccept = {
						av: api.getCurrentUserID(),
						fb_api_req_friendly_name: "FriendingCometFriendRequestConfirmMutation",
						fb_api_caller_class: "RelayModern",
						doc_id: "61584641872032",
						variables: JSON.stringify({
							input: {
								source: "friends_tab",
								friend_requester_id: reqID,
								actor_id: api.getCurrentUserID(),
								client_mutation_id: Date.now().toString()
							},
							scale: 3,
							refresh_num: 0
						})
					};

					try {
						const acceptRes = await api.httpPost("https://www.facebook.com/api/graphql/", formAccept);
						if (!JSON.parse(acceptRes).errors) {
							successCount++;
						} else {
							failCount++;
						}
					} catch (e) {
						failCount++;
					}

					await new Promise(r => setTimeout(r, 1000));
				}

				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ 𝐁𝐀𝐓𝐂𝐇 𝐀𝐂𝐂𝐄𝐏𝐓 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄!
» ✔️ সফলভাবে একসেপ্ট হয়েছে: ${successCount} টি
» ❌ ব্যর্থ হয়েছে: ${failCount} টি
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);

			} catch (err) {
				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐄𝐑𝐑𝐎𝐑 𝐎𝐂𝐂𝐔𝐑𝐑𝐄𝐃!
» ⚠️ একসেপ্ট করার কাজ সম্পন্ন করা যায়নি।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);
			}
		}

		// ৫. গাইডলাইন (যদি শুধুমাত্র কমান্ডের নাম লেখা হয়)
		else {
			return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
📖 𝐔𝐒𝐀𝐆𝐄 𝐆𝐔𝐈𝐃𝐄𝐋𝐈𝐍𝐄 :

» friend add
বটের আইডি থেকে নির্দিষ্ট ইউজারকে ফ্রেন্ড রিকোয়েস্ট পাঠানোর জন্য। (সকল ব্যবহারকারী)

» friend unfriend
বটের ফ্রেন্ড লিস্ট থেকে কাউকে আনফ্রেন্ড করার জন্য। (সকল ব্যবহারকারী)

» friend count
বটের আইডিতে মোট কতটি পেন্ডিং ফ্রেন্ড রিকোয়েস্ট আছে তা দেখার জন্য। (শুধুমাত্র এডমিন)

» friend accept
বটের আইডিতে থাকা রিকোয়েস্টগুলো থেকে একসাথে ১০টি একসেপ্ট করার জন্য। (শুধুমাত্র এডমিন)

───────────────
📌 Note: add এবং unfriend করার সময় মেসেজে রিপ্লাই, কাউকে মেনশন অথবা আইডি দিতে পারবেন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
			);
		}
	}
};
