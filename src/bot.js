require("dotenv").config()
const env = process.env
const {Telegraf, Telegram} = require("telegraf")
const alphabets = require("./alphabets.json")
const {
	arrayChunk,
	arrayFindAll,
	trimMessage,
	arrayRandom,
	arrayShuffle,
	getRandomInt,
} = require("./utils.js")
const {saveMessage, updateMessage, getLastMessage, saveInlineQuery} = require("./db.js")
const emojis = require("./emojis.json")

const bot = new Telegraf(env.BOT_TOKEN)

const commands = [
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
				const replaceMap = {
					ъ: () => "'",

					э: () => "є",
					Э: () => "Є",

					е: () => arrayRandom(["є", "и", "е"]),
					Е: () => arrayRandom(["Є", "И", "Е"]),

					и: () => (Math.random() > 0.8 ? "i" : "и"),
					И: () => (Math.random() > 0.8 ? "I" : "И"),

					о: () => (Math.random() > 0.85 ? "i" : "о"),
					О: () => (Math.random() > 0.85 ? "I" : "О"),

					й: () => "ї",
					Й: () => "Ї",

					c: () => arrayRandom(["з", "с"]),
					C: () => arrayRandom(["З", "С"]),

					ы: () => arrayRandom(["и", "ы"]),
					Ы: () => arrayRandom(["И", "Ы"]),

					г: () => arrayRandom(["ґ", "г"]),
					Г: () => arrayRandom(["Ґ", "Г"]),
				}
				return replaceMap[letter] ? arrayRandom(replaceMap[letter]()) : letter
			}

			const replaceLetters = str => {
				const lettersToBeReplaced = [
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
				const replaceChain = [
					{
						regExp: letter => new RegExp(`(${uaLettersForRegExp})(${letter})`, "gi"),
						callback: (...match) => `${match[1]}${getReplacement(match[2])}`,
					},
					{
						regExp: letter => new RegExp(`(${letter})(${uaLettersForRegExp})`, "gi"),
						callback: (...match) => `${getReplacement(match[1])}${match[2]}`,
					},
					{
						regExp: letter =>
							new RegExp(
								`(${uaLettersForRegExp})(${letter})(${uaLettersForRegExp})`,
								"gi"
							),
						callback: (...match) => `${match[1]}${getReplacement(match[2])}${match[3]}`,
					},
					{
						regExp: letter => new RegExp(` (${letter}) `, "gi"),
						callback: (...match) => ` ${getReplacement(match[1])} `,
					},
					{
						regExp: letter => new RegExp(`^(${letter})`, "gi"),
						callback: (...match) => getReplacement(match[1]),
					},
					{
						regExp: letter => new RegExp(`(${letter})$`, "gi"),
						callback: (...match) => getReplacement(match[1]),
					},
				]
				lettersToBeReplaced.forEach(letter => {
					replaceChain.forEach(({regExp, callback}) => {
						str = str.replace(regExp(letter), callback)
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
				let result = ""
				for (const word in words) {
					const replacement = words[word]
					const wordWithReplacedLetters = replaceLetters(word)
					result = str
						.replace(new RegExp(`^${wordWithReplacedLetters}`, "mg"), replacement)
						.replace(new RegExp(` ${wordWithReplacedLetters}`, "mg"), ` ${replacement}`)
						.replace(
							new RegExp(`^${wordWithReplacedLetters} `, "mg"),
							`${replacement} `
						)
						.replace(
							new RegExp(` ${wordWithReplacedLetters} `, "mg"),
							` ${replacement} `
						)
				}
				return result
			}

			return replaceWords(replaceLetters(str))
				.replace(new RegExp(`/(${uaLettersForRegExp})тся/mu`), "$1ться")
				.replace(/ая /mu, "а ", str)
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
	{
		command: "EmojiPasta🤩🥰✨",
		processor: str => {
			if (str.length > 2048) {
				return "❌ Слишком длинный текст. Данная команда работает в пределах 10-2048 символов. Выберите другую команду или пришлите текст покороче"
			} else if (str.length < 10) {
				return "❌ Слишком короткий текст. Данная команда работает лучше с большими предожениями."
			}

			const probability = p => {
				return p >= Math.random()
			}

			const splitIntoBlocks = str => {
				const symbols = "!\"#%&'()*+,-./:;<=>?@[]^_`{|}~ \n\\"
				const result = []
				if (str.length === 0) return result
				let isSymbol = false
				let word = ""
				str.split("").forEach(letter => {
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
				return emojis.filter(emoji => {
					if (word.length >= 3 && word.includes(emoji.keywords)) {
						return true
					} else if (
						emoji.keywords.filter(keyword => {
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
						const foundEmojis = searchEmojis(block.lowercase)
						if (foundEmojis) {
							const foundEmojisAmount = foundEmojis.length
							result += block.substring
							result += arrayShuffle(foundEmojis)
								.slice(0, foundEmojisAmount >= 3 ? 3 : foundEmojisAmount)
								.map(({char}) => char)
								.join("")
						} else {
							result += block.substring
							if (block.substring.length >= 4 && probability(0.45)) {
								result += `${arrayRandom(emojis).char}${arrayRandom(emojis).char}`
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
		command: "Невидимые переносы для Instagram",
		processor: str => {
			return str.replace(/\n\n+/gm, match => `\n${"⠀\n".repeat(match.length - 1)}`)
		},
	},
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

			Канал автора: @FilteredInternet
			`),
		{
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: "Попробовать инлайн-режим",
							switch_inline_query: "",
						},
					],
				],
			},
		}
	)
})

bot.on("inline_query", async ctx => {
	console.log("inline_query")
	const {query} = ctx.update.inline_query

	if (query.length > 0) {
		ctx.answerInlineQuery(
			commands.map(({processor, command}) => {
				const messageOut = processor(query)
				return {
					type: "article",
					id: `${command}_${getRandomInt(1, 99999999)}`,
					title: command,
					description: messageOut,
					input_message_content: {
						message_text: messageOut,
						disable_web_page_preview: true,
					},
				}
			})
		)
	} else {
		ctx.answerInlineQuery([], {
			switch_pm_text: "Введите больше символов",
			switch_pm_parameter: "start",
		})
	}
})

bot.on("chosen_inline_result", async ctx => {
	console.log("chosen_inline_result")
	const {result_id, query} = ctx.update.chosen_inline_result
	const usedCommand = result_id.split("_")[0]
	const {from} = ctx
	const {command, processor} = commands.find(({command}) => command === usedCommand)
	await saveInlineQuery({
		chat_id: from.id,
		username: from.username,
		first_name: from.first_name,
		language_code: from.language_code,
		message_in: query,
		message_out: processor(query),
		command,
	})
})

bot.on("message", async ctx => {
	console.log("message")
	const {text, caption, from, via_bot} = ctx.message
	const {id: chat_id} = from
	const messageIn = text || caption || ""

	if (via_bot?.id === ctx.botInfo.id) return
	await ctx.replyWithChatAction("typing")
	if (messageIn === "") {
		return ctx.reply("В этом сообщении нет текста 😐")
	}
	if (commandsList.includes(messageIn)) {
		//пришла команда, достаем предыдущее сообщение
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
				key: lastMessage.key,
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

module.exports = bot
