const fs = require("fs-extra");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
	config: {
		name: "friend",
		aliases: ["addme", "friendlist", "acceptall"],
		version: "3.0",
		author: LOCKED_AUTHOR,
		countDown: 3,
		role: 0,
		description: {
			en: "Send friend request, check pending requests, or accept all pending friend requests"
		},
		category: "utility"
	},

	onStart: async function ({ api, message, event, args, role }) {

		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
			fs.writeFileSync(__filename, fs.readFileSync(__filename, "utf8"));
		}

		const subCommand = args[0] ? args[0].toLowerCase() : "";

		if (subCommand === "check" || subCommand === "list" || subCommand === "count") {
			if (role < 1) {
				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝐀𝐂𝐂𝐄𝐒𝐒 𝐃𝐄𝐍𝐈𝐄𝐃
» 🚫 𝐎𝐧𝐥𝐲 𝐁𝐨𝐭 𝐀𝐝𝐦𝐢𝐧 𝐜𝐚𝐧 𝐜𝐡𝐞𝐜𝐤
» 🔐 𝐏𝐞𝐧𝐝𝐢𝐧𝐠 𝐅𝐫𝐢𝐞𝐧𝐝 𝐑𝐞𝐪𝐮𝐞𝐬𝐭𝐬!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);
			}

			try {
				const form = {
					av: api.getCurrentUserID(),
					fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQuery",
					doc_id: "4498306353562301",
					variables: JSON.stringify({ scale: 1 })
				};

				const res = await api.httpPost("https://www.facebook.com/api/graphql/", form);
				const parsedData = typeof res === "string" ? JSON.parse(res) : res;
				const requestList = parsedData?.data?.viewer?.friend_requests?.edges || [];

				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📩 𝐓𝐎𝐓𝐀𝐋 𝐏𝐄𝐍𝐃𝐈𝐍𝐆 𝐑𝐄𝐐𝐔𝐄𝐒𝐓𝐒 :
» 👉 [ ${requestList.length} ]
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);
			} catch (err) {
				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 𝐅𝐄𝐓𝐂𝐇 𝐑𝐄𝐐𝐔𝐄𝐒𝐓𝐒
» ⚠️ 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐒𝐞𝐬𝐬𝐢𝐨𝐧 𝐨𝐫 𝐀𝐏𝐈 𝐋𝐢𝐦𝐢𝐭!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);
			}
		}

		if (subCommand === "accept" || subCommand === "acceptall") {
			if (role < 1) {
				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝐀𝐂𝐂𝐄𝐒𝐒 𝐃𝐄𝐍𝐈𝐄𝐃
» 🚫 𝐎𝐧𝐥𝐲 𝐁𝐨𝐭 𝐀𝐝𝐦𝐢𝐧 𝐜𝐚𝐧 𝐚𝐜𝐜𝐞𝐩𝐭
» 🔐 𝐏𝐞𝐧𝐝𝐢𝐧𝐠 𝐅𝐫𝐢𝐞𝐧𝐝 𝐑𝐞𝐪𝐮𝐞𝐬𝐭𝐬!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);
			}

			try {
				const form = {
					av: api.getCurrentUserID(),
					fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQuery",
					doc_id: "4498306353562301",
					variables: JSON.stringify({ scale: 1 })
				};

				const res = await api.httpPost("https://www.facebook.com/api/graphql/", form);
				const parsedData = typeof res === "string" ? JSON.parse(res) : res;
				const requestList = parsedData?.data?.viewer?.friend_requests?.edges || [];

				if (requestList.length === 0) {
					return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ℹ️ 𝐍𝐎 𝐏𝐄𝐍𝐃𝐈𝐍𝐆 
» 🐷 𝐅𝐑𝐈𝐄𝐍𝐃 𝐑𝐄𝐐𝐔𝐄𝐒𝐓𝐒
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
					);
				}

				let successCount = 0;
				let failedCount = 0;

				for (const item of requestList) {
					const uid = item.node?.id;
					if (!uid) continue;

					try {
						const acceptForm = {
							av: api.getCurrentUserID(),
							fb_api_req_friendly_name: "FriendingCometFriendRequestConfirmMutation",
							doc_id: "5723821814324204",
							variables: JSON.stringify({
								input: {
									friend_request_action: "CONFIRM",
									friend_request_ee_id: uid,
									source: "friends_tab"
								}
							})
						};
						await api.httpPost("https://www.facebook.com/api/graphql/", acceptForm);
						successCount++;
					} catch (e) {
						failedCount++;
					}
				}

				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ 𝐀𝐂𝐂𝐄𝐏𝐓𝐄𝐃 : [ ${successCount} ]
» ❌ 𝐅𝐀𝐈𝐋𝐄𝐃 : [ ${failedCount} ]
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);
			} catch (err) {
				return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 
» 😭 𝐏𝐑𝐎𝐂𝐄𝐒𝐒 𝐑𝐄𝐐𝐔𝐄𝐒𝐓𝐒
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
				);
			}
		}

		const targetID = event.senderID;

		try {
			const sendForm = {
				av: api.getCurrentUserID(),
				fb_api_req_friendly_name: "FriendingCometFriendRequestSendMutation",
				doc_id: "5248698505244502",
				variables: JSON.stringify({
					input: {
						friend_requestee_id: targetID,
						source: "profile_button"
					}
				})
			};

			await api.httpPost("https://www.facebook.com/api/graphql/", sendForm);

			return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ 𝐅𝐑𝐈𝐄𝐍𝐃 𝐑𝐄𝐐𝐔𝐄𝐒𝐓 𝐒𝐄𝐍𝐓!
» 👤 𝐔𝐒𝐄𝐑 𝐈𝐃 : ${targetID}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
			);
		} catch (err) {
			return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 𝐒𝐄𝐍𝐃 
» 🙂 𝐑𝐄𝐐𝐔𝐄𝐒𝐓
» ⚠️ 𝐀𝐥𝐫𝐞𝐚𝐝𝐲 𝐅𝐫𝐢𝐞𝐧𝐝𝐬 
» 😔 𝐏𝐞𝐧𝐝𝐢𝐧𝐠 𝐨𝐫 𝐏𝐫𝐢𝐯𝐚𝐜𝐲 𝐁𝐥𝐨𝐜𝐤𝐞𝐝!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
			);
		}
	}
};
