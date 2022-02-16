<?php
	require_once("config.php");
	require_once("functions.php");

	$input = parse_input();
	
	$initial_commands = [
		[
			"command" => "EmojiPasta🤩🥰✨",
			"processor" => function ($str) {
				if (mb_strlen($str) > 2048) {
					return "❌ Слишком длинный текст. Данная команда работает в пределах 2048 символов. Выберите другую команду или пришлите текст покороче";
				}
				$emojis = json_decode(file_get_contents("./emojis.json"), true);
				
				function probability($p) {
					return $p >= (rand(0, 100) / 100);
				}

				function split_into_blocks($str) {
					$symbols = "!\"#$%&\'()*+,-./:;<=>?@[]^_`{|}~ \n\\";
					$result = [];
					if (mb_strlen($str) === 0) return $result;
					$isSymbol = false;
					$word = "";
					$letters = str_split($str);
					foreach ($letters as $letter) {
						$containsSymbol = mb_strpos($symbols, $letter) !== false;
						if ($isSymbol) {
							if ($containsSymbol) {
								$word .= $letter;
							}
							else {
								$isSymbol = false;
								if (mb_strlen($word) > 0) {
									array_push($result, [
										"substring" => $word,
										//"length" => mb_strlen($word),
										"type" => "symbol"
									]);
								}
								$word = $letter;
							}
						}
						else {
							if (!$containsSymbol) {
								$word .= $letter;
							}
							else {
								$isSymbol = true;
								if (mb_strlen($word) > 0) {
									array_push($result, [
										"substring" => $word,
										"lowercase" => mb_strtolower($word),
										"type" => "word"
									]);
								}
								$word = $letter;
							}
						}
					}
					if (mb_strlen($word) > 0) {
						array_push($result, $isSymbol ? 
							[
								"substring" => $word,
								"type" => "symbol"
							]
							:
							[
								"substring" => $word,
								"lowercase" => mb_strtolower($word),
								"type" => "word"
							]
						);
					}
					return $result;
				}

				$searchEmojis = function($word) use ($emojis) {
					return array_find_all($emojis, function($emoji) use ($word) {
						if (mb_strlen($word) >= 3 && in_array($word, $emoji["keywords"])) {
							return true;
						}
						else if (count(array_filter($emoji["keywords"], function($keyword) use ($word) {
							return (
								mb_strlen($word) >= 5 && strrpos($keyword, $word) === 0 ||
								mb_strlen($keyword) >= 5 && strrpos($word, $keyword) === 0 ||
								(mb_strlen($word) >= 4 && mb_strlen($keyword) >= 4 && mb_substr($keyword, 0, 4) === mb_substr($word, 0, 4))
							);
						})) > 0) {
							return true;
						}
						return false;
					});
				};

				$emojify = function($blocks) use ($emojis, $searchEmojis) {
					$result = "";
					foreach ($blocks as $block) {
						if ($block["type"] === "symbol") {
							$result .= $block["substring"];
						}
						else {
							$foundEmojis = $searchEmojis($block["lowercase"]);
							if ($foundEmojis) {
								$foundEmojisAmount = count($foundEmojis);
								$result .= $block["substring"];
								$emojiIndexes = array_rand($foundEmojis, rand(1, $foundEmojisAmount >= 3 ? 3 : $foundEmojisAmount));
								$emojiIndexes = is_array($emojiIndexes) ? $emojiIndexes : [$emojiIndexes];
								foreach ($emojiIndexes as $index) {
									$result .= $foundEmojis[$index]["char"];
								}
							}
							else {
								$result .= $block["substring"];
								if (mb_strlen($block["substring"]) >= 4 && probability(.45)) {
									$emojiIndexes = array_rand($emojis, rand(2, 3));
									foreach ($emojiIndexes as $index) {
										$result .= $emojis[$index]["char"];
									}
								}
							}
						}
					}
					return $result;
				};
				
				$split = split_into_blocks($str);
				$emojified = $emojify($split);
				return $emojified;
			}
		],
		[
			"command" => "qɯʎнdǝʚǝdǝu",
			"processor" => function ($str) {
				$alphabet = ["а" => "ɐ", "б" => "ƍ", "в" => "ʚ", "г" => "ɹ", "д" => "ɓ", "е" => "ǝ", "ё" => "ǝ", "ж" => "ж", "з" => "ε", "и" => "и", "й" => "ņ", "к" => "ʞ", "л" => "v", "м" => "w", "н" => "н", "о" => "о", "п" => "u", "р" => "d", "с" => "ɔ", "т" => "ɯ", "у" => "ʎ", "ф" => "ф", "х" => "х", "ц" => "ǹ", "ч" => "Һ", "ш" => "m", "щ" => "m", "ъ" => "q", "ы" => "qı", "ь" => "q", "э" => "є", "ю" => "ıo", "я" => "ʁ", "a" => "ɐ", "b" => "q", "c" => "ɔ", "d" => "р", "e" => "ǝ", "f" => "ɟ", "g" => "ƃ", "h" => "ɥ", "i" => "ı", "j" => "ɾ", "k" => "ʞ", "l" => "l", "m" => "ɯ", "n" => "u", "o" => "o", "p" => "d", "q" => "ь", "r" => "ɹ", "s" => "s", "t" => "ʇ", "u" => "п", "v" => "л", "w" => "м", "x" => "x", "y" => "ʎ", "z" => "z", "." => "˙", "[" => "]", "]" => "[", "(" => ")", ")" => "(", "{" => "}", "}" => "{", "?" => "¿", "!" => "¡", "'" => ",", "," => "'", "<" => ">", ">" => "<", "_" => "‾"];
				$str_split = mb_str_split(mb_strtolower($str));
				$str_rotated = "";
				foreach ($str_split as $letter) {
					$str_rotated .= isset($alphabet[$letter]) ? $alphabet[$letter] : $letter;
				}
				return mb_strrev($str_rotated);
			}
		],
		[
			"command" => "ТоКсИк",
			"processor" => function ($str) {
				$res = "";
				$reverse = false;
				foreach (mb_str_split($str) as $index => $letter) {
					$letter === " " && $reverse = !$reverse;
					if ($reverse) {
						$res .= $index % 2 === 0 ? mb_strtolower($letter) : mb_strtoupper($letter);
					}
					else {
						$res .= $index % 2 === 0 ? mb_strtoupper($letter) : mb_strtolower($letter);
					}
				}
				return $res;
			}
		],
		[
			"command" => "Український 🇺🇦",
			"processor" => function ($str) {
				function get_replacement($letter) {
					$letters = [
						"ъ" => ["'"],

						"э" => ["є"],
						"Э" => ["Є"],

						"е" => ["є", "и", "е"],
						"Е" => ["Є", "И", "Е"],

						"и" => ["i", "и"],
						"И" => ["I", "И"],

						"о" => ["о", "о", "о", "i"],
						"О" => ["О", "О", "О", "I"],

						"й" => ["ї"],
						"Й" => ["Ї"],

						"c" => ["з", "с"],
						"C" => ["З", "С"],

						"ы" => ["и", "ы"],
						"Ы" => ["И", "Ы"],

						"г" => ["ґ", "г"],
						"Г" => ["Ґ", "Г"],
					];
					if (array_key_exists($letter, $letters)) {
						return array_rand_item($letters[$letter]);
					}
					else {
						return $letter;
					}
				};

				function replace_letters($str) {
					$letters = ["ъ", "э", "Э", "е", "Е", "и", "И", "о", "О", "й", "Й", "c", "C", "ы", "Ы", "г", "Г"];
					foreach ($letters as $letter) {
						$letter_escaped = preg_quote($letter);
						$chain = [
							"/([А-Яа-яёЁЇїІіЄєҐґ])" . $letter_escaped . "/mu" => function() use ($letter) {return "$1" . get_replacement($letter);},
							"/" . $letter_escaped . "([А-Яа-яёЁЇїІіЄєҐґ])/mu" => function() use ($letter) {return get_replacement($letter) . "$1";},
							"/([А-Яа-яёЁЇїІіЄєҐґ])" . $letter_escaped . "([А-Яа-яёЁЇїІіЄєҐґ])/mu" => function() use ($letter) {return "$1" . get_replacement($letter) . "$2";},
							"/^" . $letter_escaped . "/mu" => function() use ($letter) {return get_replacement($letter);},
							"/ " . $letter_escaped . " /mu" => function() use ($letter) {return " " . get_replacement($letter) . " ";},
							"/^" . $letter_escaped . "/mu" => function() use ($letter) {return get_replacement($letter);},
							"/" . $letter_escaped . "$/mu" => function() use ($letter) {return get_replacement($letter);}
						];
						foreach($chain as $reg => $replace) {
							if (preg_match($reg, $str)) {
								$str = preg_replace_callback($reg, function($arr) use ($reg, $replace) {
									return preg_replace($reg, $replace(), $arr[0]);
								}, $str);
							}
						}
					}
					return $str;
				}

				function replace_words($str) {
					$words = [
						"с" => "з",
						"С" => "З",

						"и" => "i",
						"И" => "I",

						"это" => "є",
						"Это" => "Є",

						"его" => "його",
						"Его" => "Його",

						"ее" => "її",
						"Ее" => "Її",

						"что" => "що",
						"Что" => "Що",

						"как" => "як",
						"Как" => "Як",

						"где" => "де",
						"Где" => "Де",

						"под" => "під",
						"Под" => "Під",

						"когда" => "коли",
						"Когда" => "Коли",

						"какой" => "який",
						"Какой" => "Який",
					];
					foreach($words as $word => $replace) {
						$word = replace_letters($word);
						$str = preg_replace("/^" . $word . "$/mu", $replace, $str);
						$str = preg_replace("/ " . $word . "$/mu", " " . $replace, $str);
						$str = preg_replace("/^" . $word . " /mu", $replace . " ", $str);
						$str = preg_replace("/ " . $word . " /mu", " " . $replace . " ", $str);
					}
					return $str;
				}
				$str = replace_words(replace_letters($str));
				$str = preg_replace("/([А-Яа-яёЁЇїІіЄєҐґ])тся/mu", "$1ться", $str);
				$str = preg_replace("/ая /mu", "а ", $str);
				return $str;
			}
		],
		[
			"command" => "Транслитерация",
			"processor" => function ($str) {
				$alphabet = ["а" => "a", "б" => "b", "в" => "v", "г" => "g", "д" => "d", "е" => "e", "ё" => "e", "ж" => "zh", "з" => "z", "и" => "i", "й" => "y", "к" => "k", "л" => "l", "м" => "m", "н" => "n", "о" => "o", "п" => "p", "р" => "r", "с" => "s", "т" => "t", "у" => "u", "ф" => "f", "х" => "h", "ц" => "c", "ч" => "ch", "ш" => "sh", "щ" => "sch", "ь" => "'", "ы" => "y", "ъ" => "'", "э" => "e", "ю" => "yu", "я" => "ya", "А" => "A", "Б" => "B", "В" => "V", "Г" => "G", "Д" => "D", "Е" => "E", "Ё" => "E", "Ж" => "Zh", "З" => "Z", "И" => "I", "Й" => "Y", "К" => "K", "Л" => "L", "М" => "M", "Н" => "N", "О" => "O", "П" => "P", "Р" => "R", "С" => "S", "Т" => "T", "У" => "U", "Ф" => "F", "Х" => "H", "Ц" => "C", "Ч" => "Ch", "Ш" => "Sh", "Щ" => "Sch", "Ь" => "'", "Ы" => "Y", "Ъ" => "'", "Э" => "E", "Ю" => "Yu", "Я" => "Ya"];
				return str_replace(array_keys($alphabet), array_values($alphabet), $str);
			}
		],
		[
			"command" => "Невидимые переносы для Instagram",
			"processor" => function ($str) {
				$str = preg_replace_callback("/\n\n+/", function ($match) {
					return "\n" . str_repeat("⠀\n", mb_strlen($match[0]) - 1);
				}, $str);
				return $str;
			}
		]
	];

	$alphabet_commands_data = json_decode(file_get_contents("./alphabet.json"), true);
	$alphabet_commands = array_map(
		function ($alphabet_item) use ($initial_commands) {
			return [
				"command" => $alphabet_item["command"],
				"processor" => function ($str) use ($initial_commands, $alphabet_item) {
					$transliterate_command = array_find($initial_commands, function ($item) {//находи объект команды транслитерации
						return $item["command"] === "Транслитерация";
					});
					$transliterated = $transliterate_command["processor"]($str);
					return str_replace(array_keys($alphabet_item["alphabet"]), array_values($alphabet_item["alphabet"]), $transliterated);
				}
			];
		},
		$alphabet_commands_data
	);

	$commands = array_merge($alphabet_commands, $initial_commands);
	$commands_list = array_map(
		function ($item) {
			return $item["command"];
		},
		$commands
	);


	$keyboards = [
		"default" => json_encode([
			"one_time_keyboard" => true,
			"keyboard" => array_chunk($commands_list, 2)
		]),
		"remove" => json_encode(["remove_keyboard" => true])
	];

	$pdo = new_pdo(MYSQLI_HOST, MYSQLI_USERNAME, MYSQLI_PASSWORD, MYSQLI_MAIN_DB);
	$query = $state = [];

	if (isset($input["inline_query"])) {
		$q = $input["inline_query"]["query"];
		if (mb_strlen($q) > 0) {
			api("answerInlineQuery", [
				"inline_query_id" => $input["inline_query"]["id"],
				"results" => json_encode(array_map(function ($command) use ($q) {
					$message_out = $command["processor"]($q);//отправляем предыдущее сообщение в процессор команды

					return [
						"type" => "article",
						"id" => $command["command"] . "_" . rand(1, 100000),
						"title" => $command["command"],
						"description" => $message_out,
						"input_message_content" => [
							"message_text" => $message_out,
							"disable_web_page_preview" => false,
						]
					];
				}, $commands))
			]);
		}
		else {
			api("answerInlineQuery", [
				"inline_query_id" => $input["inline_query"]["id"],
				"results" => json_encode([
					[
						"type" => "article",
						"id" => 0,
						"title" => "Введите текст",
						"description" => "Напиши что-нибудь после @BiographerBot",
						"input_message_content" => [
							"message_text" => "Нажми «Перейти в инлайн» и напиши текст после юзернейма бота.",
							"disable_web_page_preview" => false,
						],
						"reply_markup" => [
							"inline_keyboard" => [
								[
									[
										"text" => "Перейти в инлайн",
										"switch_inline_query_current_chat" => ""
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

	if (isset($input["chosen_inline_result"])) {
		$inline_command = explode("_", $input["chosen_inline_result"]["result_id"])[0];
		$command = array_find($commands, function ($item) use ($inline_command) {//находи объект команды
			return $item["command"] === $inline_command;
		});
		$query["create_session"] = $pdo->prepare("INSERT INTO `biographer` (`first_name`, `chat_id`, `message_in`, `message_out`, `date`, `username`, `command`, `is_inline`) VALUES (:first_name, :chat_id, :message_in, :message_out, :date, :username, :command, 1)");
		$state["create_session"] = $query["create_session"]->execute([
			"chat_id" => $input["chosen_inline_result"]["from"]["id"],
			"message_in" => $input["chosen_inline_result"]["query"],
			"message_out" => $command["processor"]($input["chosen_inline_result"]["query"]),
			"first_name" => $input["chosen_inline_result"]["from"]["first_name"],
			"date" => format_time(time()),
			"command" => $inline_command,
			"username" => isset($input["chosen_inline_result"]["from"]["username"]) ? $input["chosen_inline_result"]["from"]["username"] : ""
		]);
	}

	if (isset($input["message"])) {
		$message = $input["message"];
		$chat_id = $message["chat"]["id"];

		if (
			(isset($message["via_bot"]) && $message["via_bot"]["id"] === BOT_ID) ||
			isset($message["left_chat_member"])
		) {
			exit;
		}
		if (isset($message["new_chat_member"])) {
			if ($message["new_chat_member"]["id"] === BOT_ID) {
				greet($chat_id);
			}
			exit;
		}

		$look_for_text = ["text", "caption"];
		$message_in = "";
		foreach ($look_for_text as $key) {
			if (isset($message[$key])) {
				$message_in = $message[$key];
			}
		}
		if ($message_in === "") {
			api("sendMessage", [
				"chat_id" => $chat_id,
				"text" => "В этом сообщении нет текста 😐",
				"disable_web_page_preview" => true
			]);
			exit;
		}

		if ($message_in === "Начать" || $message_in === "/start" || $message_in === "/start@" . BOT_USERNAME) {
			greet($chat_id);
			exit;
		}

		if ($message_in === "/donate" || $message_in === "/donate@" . BOT_USERNAME) {
			api("sendMessage", [
				"chat_id" => $chat_id,
				"parse_mode" => "Markdown",
				"text" => trim_message("
					Проще всего задонатить здесь: babki.mishasaidov.com

					ЮMoney (Яндекс.Деньги): `4100117319944149`
					QIWI: `+77002622563`
					BTC: `1MDRDDBURiPEg93epMiryCdGvhEncyAbpy`
					Kaspi (Казахстан): `5169497160435198`
				"),
			]);
			exit;
		}

		if (in_array($message_in, $commands_list)) {//пришла команда
			//достаем предыдущее сообщение
			$query["last_session"] = $pdo->prepare("SELECT * FROM `biographer` WHERE `chat_id`= :chat_id AND `is_inline` = 0 ORDER BY `id` DESC LIMIT 1");
			$state["last_session"] = $query["last_session"]->execute([
				"chat_id" => $chat_id,
			]);
			$data["last_session"] = process_query($query["last_session"]);

			if (count($data["last_session"]) === 1) { //сообщение есть
				$data["last_session"] = $data["last_session"][0];

				$command = array_find($commands, function ($item) use ($message_in) {//находи объект команды
					return $item["command"] === $message_in;
				});
				$message_out = $command["processor"]($data["last_session"]["message_in"]);//отправляем предыдущее сообщение в процессор команды
				
				api("sendMessage", [
					"chat_id" => $chat_id,
					"text" => $message_out,//$message_out,
					"disable_web_page_preview" => true,
					"reply_markup" => $keyboards["remove"]
				]);

				//закрываем сессию, заполняя ее отправленным сообщение и выбранной командой
				$query["end_session"] = $pdo->prepare("UPDATE `biographer` SET `message_out` = :message_out, `command` = :command WHERE `id` = :id");
				$state["end_session"] = $query["end_session"]->execute([
					"id" => $data["last_session"]["id"],
					"message_out" => $message_out,
					"command" => $message_in,
				]);
			}
			else { //сессия не найденна но прислана команда
				api("sendMessage", [
					"chat_id" => $chat_id,
					"text" => "🤔 Хм, мы не нашли твое сообщение. Давай заново. Пришли мне текст, который нужно обработать. Учти, что большинство шрифтов работает только с латиницей.",
					"reply_markup" => $keyboards["remove"]
				]);
			}
		}
		else {
			//пришел текст, который нужно обработать, создаем сессию
			$query["create_session"] = $pdo->prepare("INSERT INTO `biographer` (`first_name`, `chat_id`, `message_in`, `date`, `is_inline`, `username`) VALUES (:first_name, :chat_id, :message_in, :date, 0, :username)");
			$state["create_session"] = $query["create_session"]->execute([
				"chat_id" => $chat_id,
				"message_in" => $message_in,
				"first_name" => $message["from"]["first_name"],
				"date" => format_time($message["date"]),
				"username" => isset($message["from"]["username"]) ? $message["from"]["username"] : ""
			]);

			if ($state["create_session"]) {
				api("sendMessage", [
					"chat_id" => $chat_id,
					"text" => "Ок, теперь выбери, что нужно сделать с текстом. Учти, что большинство шрифтов работает только с латиницей.",
					"reply_markup" => $keyboards["default"]
				]);
			}
			else {
				api("sendMessage", [
					"chat_id" => $chat_id,
					"text" => "🤔 Кажется, у нас технические неполадки. Скоро все заработает.",
					"reply_markup" => $keyboards["default"]
				]);
			}
		}
	}