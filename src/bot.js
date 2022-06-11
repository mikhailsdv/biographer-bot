require("dotenv").config()
const env = process.env
const {Telegraf, Telegram} = require("telegraf")
const alphabets = require("./alphabets.json")
const {arrayChunk, trimMessage, arrayRandom} = require("./utils.js")
const {saveMessage, updateMessage, getLastMessage} = require("./db.js")

const bot = new Telegraf(env.BOT_TOKEN)

const commands = [
	{
		command: "EmojiPasta🤩🥰✨",
		processor: str => {
			if (str.length > 2048) {
				return "❌ Слишком длинный текст. Данная команда работает в пределах 2048 символов. Выберите другую команду или пришлите текст покороче"
			}
			const emojis = json_decode(file_get_contents("./emojis.json"), true)

			const probability = p => {
				return p >= rand(0, 100) / 100
			}

			const splitIntoBlocks = str => {
				const symbols = "!\"#%&'()*+,-./:;<=>?@[]^_`{|}~ \n\\"
				const result = []
				if (str.length === 0) return result
				const isSymbol = false
				let word = ""
				const letters = str.split("")
				letters.foreach(letter => {
					const containsSymbol = symbols.indexOf(letter) >= 0
					if (isSymbol) {
						if (containsSymbol) {
							word += letter
						} else {
							isSymbol = false
							if (word.length > 0) {
								result.push({
									substring: word,
									//"length": word.length,
									type: "symbol",
								})
							}
							word = letter
						}
					} else {
						if (!containsSymbol) {
							word += letter
						} else {
							isSymbol = true
							if (word.length > 0) {
								result.push({
									substring: word,
									lowercase: word.toLowerCase(),
									type: "word",
								})
							}
							word = letter
						}
					}
				})
				if (word.length > 0) {
					result.push(
						isSymbol
							? {
									substring: word,
									type: "symbol",
							  }
							: {
									substring: word,
									lowercase: word.toLowerCase(),
									type: "word",
							  }
					)
				}
				return result
			}

			const searchEmojis = word => {
				return arrayFindAll(emojis, emoji => {
					if (word.length >= 3 && word.includes(emoji["keywords"])) {
						return true
					} else if (
						emoji["keywords"].filter(keyword => {
							return (
								(word.length >= 5 && keyword.indexOf(word) === 0) ||
								(keyword.length >= 5 && word.indexOf(keyword) === 0) ||
								(word.length >= 4 &&
									keyword.length >= 4 &&
									keyword.substr(0, 4) === word.substr(0, 4))
							)
						}).length > 0
					) {
						return true
					}
					return false
				})
			}

			const emojify = blocks => {
				let result = ""
				blocks.forEach(block => {
					if (block.type === "symbol") {
						result += block.substring
					} else {
						foundEmojis = searchEmojis(block.lowercase)
						if (foundEmojis) {
							foundEmojisAmount = count(foundEmojis)
							result += block.substring
							emojiIndexes = arrayRandom(
								foundEmojis,
								rand(1, foundEmojisAmount >= 3 ? 3 : foundEmojisAmount)
							)
							emojiIndexes = Array.isArray(emojiIndexes)
								? emojiIndexes
								: [emojiIndexes]
							emojiIndexes.forEach(index => {
								result += foundEmojis[index].char
							})
						} else {
							result += block.substring
							if (block.substring.length >= 4 && probability(0.45)) {
								emojiIndexes = arrayRandom(emojis, rand(2, 3))
								emojiIndexes.forEach(index => {
									result += emojis[index].char
								})
							}
						}
					}
				})
				return result
			}

			const split = splitIntoBlocks(str)
			const emojified = emojify(split)
			return emojified
		},
	},
	{
		command: "qɯʎнdǝʚǝdǝu",
		processor: str => {
			const alphabet = {
				а: "ɐ",
				б: "ƍ",
				в: "ʚ",
				г: "ɹ",
				д: "ɓ",
				е: "ǝ",
				ё: "ǝ",
				ж: "ж",
				з: "ε",
				и: "и",
				й: "ņ",
				к: "ʞ",
				л: "v",
				м: "w",
				н: "н",
				о: "о",
				п: "u",
				р: "d",
				с: "ɔ",
				т: "ɯ",
				у: "ʎ",
				ф: "ф",
				х: "х",
				ц: "ǹ",
				ч: "Һ",
				ш: "m",
				щ: "m",
				ъ: "q",
				ы: "qı",
				ь: "q",
				э: "є",
				ю: "ıo",
				я: "ʁ",
				a: "ɐ",
				b: "q",
				c: "ɔ",
				d: "р",
				e: "ǝ",
				f: "ɟ",
				g: "ƃ",
				h: "ɥ",
				i: "ı",
				j: "ɾ",
				k: "ʞ",
				l: "l",
				m: "ɯ",
				n: "u",
				o: "o",
				p: "d",
				q: "ь",
				r: "ɹ",
				s: "s",
				t: "ʇ",
				u: "п",
				v: "л",
				w: "м",
				x: "x",
				y: "ʎ",
				z: "z",
				".": "˙",
				"[": "]",
				"]": "[",
				"(": ")",
				")": "(",
				"{": "}",
				"}": "{",
				"?": "¿",
				"!": "¡",
				"'": ",",
				",": "'",
				"<": ">",
				">": "<",
				_: "‾",
			}
			return str
				.toLowerCase()
				.split("")
				.map(letter => alphabet[letter] || letter)
				.reverse()
				.join("")
		},
	},
	{
		command: "ТоКсИк",
		processor: function (str) {
			let reverse = false
			return str
				.split("")
				.map((letter, index) => {
					letter === " " && (reverse = !reverse)
					const isEven = index % 2 === 0
					return letter[
						["toLowerCase", "toUpperCase"][isEven ? (reverse ? 0 : 1) : reverse ? 1 : 0]
					]()
				})
				.join("")
		},
	},
	{
		command: "Український 🇺🇦",
		processor: str => {
			const uaLettersForRegExp = "[А-Яа-яёЁЇїІіЄєҐґ]"

			const getReplacement = letter => {
				const letters = {
					ъ: ["'"],

					э: ["є"],
					Э: ["Є"],

					е: ["є", "и", "е"],
					Е: ["Є", "И", "Е"],

					и: ["i", "и"],
					И: ["I", "И"],

					о: ["о", "о", "о", "i"],
					О: ["О", "О", "О", "I"],

					й: ["ї"],
					Й: ["Ї"],

					c: ["з", "с"],
					C: ["З", "С"],

					ы: ["и", "ы"],
					Ы: ["И", "Ы"],

					г: ["ґ", "г"],
					Г: ["Ґ", "Г"],
				}
				return letters[letter] ? arrayRandom(letters[letter]) : letter
			}

			const replaceLetters = str => {
				const letters = [
					"ъ",
					"э",
					"Э",
					"е",
					"Е",
					"и",
					"И",
					"о",
					"О",
					"й",
					"Й",
					"c",
					"C",
					"ы",
					"Ы",
					"г",
					"Г",
				]
				letters.forEach(letter => {
					/*const letterEscaped = letter.replace(
						/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g,
						"\\$1"
					)*/
					;[
						{
							regExp: `(${uaLettersForRegExp})${letter}`,
							callback: letter => `$1${getReplacement(letter)}`,
						},
						{
							regExp: `${letter}(${uaLettersForRegExp})`,
							callback: letter => getReplacement(letter),
						},
						{
							regExp: `(${uaLettersForRegExp})${letter}(${uaLettersForRegExp})`,
							callback: letter => `$1${getReplacement(letter)}$2`,
						},
						{
							regExp: `^${letter}`,
							callback: letter => getReplacement(letter),
						},
						{
							regExp: ` ${letter} `,
							callback: letter => ` ${getReplacement(letter)} `,
						},
						{
							regExp: `^${letter}`,
							callback: letter => getReplacement(letter),
						},
						{
							regExp: letter,
							callback: letter => getReplacement(letter),
						},
					].forEach(({regExp, callback}) => {
						if (new RegExp(regExp, "mug").test(str)) {
							str = str.replace(regExp, callback)
						}
					})
				})
				return str
			}

			const replaceWords = str => {
				const words = {
					с: "з",
					С: "З",

					и: "i",
					И: "I",

					это: "є",
					Это: "Є",

					его: "його",
					Его: "Його",

					ее: "її",
					Ее: "Її",

					что: "що",
					Что: "Що",

					как: "як",
					Как: "Як",

					где: "де",
					Где: "Де",

					под: "під",
					Под: "Під",

					когда: "коли",
					Когда: "Коли",

					какой: "який",
					Какой: "Який",
				}
				for (let word in words) {
					const replacement = words[word]
					word = replaceLetters(word)
					str = str.replace(new RegExp(`/^${word}/mu`), replacement)
					str = str.replace(new RegExp(`/ ${word}/mu`), ` ${replacement}`)
					str = str.replace(new RegExp(`/^${word} /mu`), `${replacement} `)
					str = str.replace(new RegExp(`/ ${word} /mu`), ` ${replacement} `)
				}
				return str
			}
			str = replaceWords(replaceLetters(str))
			str = str.replace(new RegExp(`/(${uaLettersForRegExp})тся/mu`), "$1ться")
			str = str.replace(/ая /mu, "а ", str)
			return str
		},
	},
	{
		command: "Транслитерация",
		processor: str => {
			const alphabet = {
				а: "a",
				б: "b",
				в: "v",
				г: "g",
				д: "d",
				е: "e",
				ё: "e",
				ж: "zh",
				з: "z",
				и: "i",
				й: "y",
				к: "k",
				л: "l",
				м: "m",
				н: "n",
				о: "o",
				п: "p",
				р: "r",
				с: "s",
				т: "t",
				у: "u",
				ф: "f",
				х: "h",
				ц: "c",
				ч: "ch",
				ш: "sh",
				щ: "sch",
				ь: "'",
				ы: "y",
				ъ: "'",
				э: "e",
				ю: "yu",
				я: "ya",
				А: "A",
				Б: "B",
				В: "V",
				Г: "G",
				Д: "D",
				Е: "E",
				Ё: "E",
				Ж: "Zh",
				З: "Z",
				И: "I",
				Й: "Y",
				К: "K",
				Л: "L",
				М: "M",
				Н: "N",
				О: "O",
				П: "P",
				Р: "R",
				С: "S",
				Т: "T",
				У: "U",
				Ф: "F",
				Х: "H",
				Ц: "C",
				Ч: "Ch",
				Ш: "Sh",
				Щ: "Sch",
				Ь: "'",
				Ы: "Y",
				Ъ: "'",
				Э: "E",
				Ю: "Yu",
				Я: "Ya",
			}
			//auto detect language
			return str
				.split("")
				.map(letter => alphabet[letter] || letter)
				.join("")
		},
	},
	/*{
		"command": "Невидимые переносы для Instagram",
		"processor":  (str) => {
			str = preg_replace_callback("/\n\n+/", function (match) {
				return "\n" . str_repeat("⠀\n", mb_strlen(match[0]) - 1);
			}, str);
			return str;
		}
	}*/
].concat(
	alphabets.map(({alphabet, command}) => ({
		command,
		processor: str => {
			const transliterateСommand = commands.find(({command}) => command === "Транслитерация")
			const transliterated = transliterateСommand.processor(str)
			return transliterated
				.split("")
				.map(letter => alphabet[letter] || letter)
				.join("")
		},
	}))
)
const commandsList = commands.map(item => item.command)

const keyboards = {
	default: {
		one_time_keyboard: true,
		keyboard: arrayChunk(commandsList, 2),
	},
	remove: {remove_keyboard: true},
}

bot.start(async ctx => {
	console.log("start")
	await ctx.replyWithMarkdown(
		trimMessage(`
			👋 Привет. Я помогу выбрать красивый шрифт или особым образом трансформирую твой текст.

			💬 Пришли мне текст, который нужно обработать. Учти, что большинство шрифтов работает только с латиницей.

			⌨️ Еще я умею работать в инлайн режиме, так что можешь в любом диалоге ввести @BiographerBot и сразу писать свой текст.

			Автор: @mikhailsdv
			Мой канал: @FilteredInternet
			`),
		{
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: "Try inline mode",
							switch_inline_query: "",
						},
					],
				],
			},
		}
	)
})

bot.on("inline_query", async ctx => {
	const {query, from, id} = ctx.update.inline_query
	console.log("inline_query", query)

	/*await bot.sendSticker({
    chat_id: chatId,
    sticker:
      "CAACAgIAAxkBAAL8WV75-kCnWs9hcYMfI9ate169VHLsAAJdAgAC3PKrB6IOmSPgo_bnGgQ",
  });*/
})

bot.command("donate", ctx => {
	log("Command /donate")
	return ctx.replyWithMarkdown(`
		Проще всего задонатить здесь: babki.mishasaidov.com

		ЮMoney: \`4100117319944149\`
		QIWI: \`+77002622563\`
		BTC: \`1MDRDDBURiPEg93epMiryCdGvhEncyAbpy\`
		Kaspi (🇰🇿): \`4400 4302 1955 7599\`
	`)
})

bot.on("message", async ctx => {
	const {text, caption, from, via_bot} = ctx.message
	const {id: chat_id} = from
	const messageIn = text || caption || ""

	if (via_bot?.id === ctx.botInfo.id) return
	if (messageIn === "") {
		return ctx.reply("В этом сообщении нет текста 😐")
	}
	if (commandsList.includes(messageIn)) {
		//пришла команда
		//достаем предыдущее сообщение
		const lastMessage = await getLastMessage({chat_id})

		if (lastMessage) {
			//сообщение есть
			const command = commands.find(({command}) => command === messageIn) //находим объект команды
			const messageOut = command.processor(lastMessage.message_in) //отправляем предыдущее сообщение в процессор команды

			await ctx.reply(messageOut, {
				disable_web_page_preview: true,
				reply_markup: keyboards.remove,
			})
			//закрываем сессию, заполняя ее отправленным сообщением и выбранной командой
			await updateMessage({
				...lastMessage,
				message_out: messageOut,
				command: messageIn,
			})
		} else {
			//сессия не найденна но прислана команда
			return ctx.reply(
				"🤔 Хм, я не нашел твое сообщение. Давай заново. Пришли мне текст, который нужно обработать. Учти, что большинство шрифтов работает только с латиницей.",
				{
					reply_markup: keyboards.remove,
				}
			)
		}
	} else {
		//пришел текст, который нужно обработать, создаем сессию
		const status = await saveMessage({
			chat_id,
			username: from.username || "",
			first_name: from.first_name || "",
			language_code: from.language_code || "",
			message_in: messageIn,
			mode: "message",
		})

		if (status) {
			await ctx.reply(
				"Ок, теперь выбери, что нужно сделать с текстом. Учти, что большинство шрифтов работает только с латиницей.",
				{
					reply_markup: keyboards.default,
				}
			)
		} else {
			await ctx.reply(
				"🤔 Кажется, у нас технические неполадки. Скоро все заработает. Напишите мне @mikhailsdv.",
				{
					reply_markup: keyboards["default"],
				}
			)
		}
	}
})

/*
if (isset(input["inline_query"])) {
	q = input["inline_query"]["query"];
	if (mb_strlen(q) > 0) {
		api("answerInlineQuery", [
			"inline_query_id": input["inline_query"]["id"],
			"results": json_encode(array_map(function (command) use (q) {
				messageOut = command["processor"](q);//отправляем предыдущее сообщение в процессор команды

				return [
					"type": "article",
					"id": command["command"] . "_" . rand(1, 100000),
					"title": command["command"],
					"description": messageOut,
					"input_message_content": [
						"message_text": messageOut,
						"disable_web_page_preview": false,
					]
				];
			}, commands))
		]);
	}
	else {
		api("answerInlineQuery", [
			"inline_query_id": input["inline_query"]["id"],
			"results": json_encode([
				[
					"type": "article",
					"id": 0,
					"title": "Введите текст",
					"description": "Напиши что-нибудь после @BiographerBot",
					"input_message_content": [
						"message_text": "Нажми «Перейти в инлайн» и напиши текст после юзернейма бота.",
						"disable_web_page_preview": false,
					],
					"reply_markup": [
						"inline_keyboard": [
							[
								[
									"text": "Перейти в инлайн",
									"switch_inline_query_current_chat": ""
								]
							],
						]
					]
				]
			]),
		]);
	}
	exit;
}

if (isset(input["chosen_inline_result"])) {
	inline_command = explode("_", input["chosen_inline_result"]["result_id"])[0];
	command = array_find(commands, function (item) use (inline_command) {//находи объект команды
		return item["command"] === inline_command;
	});
	query["create_session"] = pdo->prepare("INSERT INTO `biographer` (`first_name`, `chat_id`, `messageIn`, `messageOut`, `date`, `username`, `command`, `is_inline`) VALUES (:first_name, :chat_id, :messageIn, :messageOut, :date, :username, :command, 1)");
	state["create_session"] = query["create_session"]->execute([
		"chat_id": input["chosen_inline_result"]["from"]["id"],
		"messageIn": input["chosen_inline_result"]["query"],
		"messageOut": command["processor"](input["chosen_inline_result"]["query"]),
		"first_name": input["chosen_inline_result"]["from"]["first_name"],
		"date": format_time(time()),
		"command": inline_command,
		"username": isset(input["chosen_inline_result"]["from"]["username"]) ? input["chosen_inline_result"]["from"]["username"] : ""
	]);
}*/

module.exports = bot
