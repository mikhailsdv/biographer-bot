<?php
	require_once("config.php");

	function api($method, $parameters) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/bot" . TOKEN . "/" . $method);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($parameters));
		curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER["HTTP_USER_AGENT"]);
		$result = json_decode(curl_exec($ch), true);
		curl_close($ch);
		return $result;
		//return json_decode(file_get_contents("https://api.telegram.org/bot" . TOKEN . "/" . $method . "?" . http_build_query($parameters)), true);
	}
	function parse_input() {
		return json_decode(file_get_contents("php://input"), true);
	};
	function mb_strrev($str) {//переворачивает строку
		$r = "";
		for ($i = mb_strlen($str); $i >= 0; $i--) {
			$r .= mb_substr($str, $i, 1);
		}
		return $r;
	}
	function trim_message($str) {
		return preg_replace("/[\t]/", "", trim($str));
	}
	/*function mb_str_split($str, $split_length = 1) {
		$chars = array();
		$len = mb_strlen($str);
		for ($i = 0; $i < $len; $i += $split_length) {
			$chars[] = mb_substr($str, $i, $split_length);
		}
		return $chars;
	}*/
	function new_pdo($host, $username, $password, $db) {
		$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
		$opt = [
			PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
			PDO::ATTR_EMULATE_PREPARES   => false,
		];
		return new PDO($dsn, $username, $password, $opt);
	};
	function process_query($response) {
		$result = [];
		if ($response) {
			while ($row = $response->fetch(PDO::FETCH_ASSOC)) {
				array_push($result, $row);
			}
			return $result;
		}
		else {
			return false;
		}
	};
	function array_find($xs, $f) {
		foreach ($xs as $x) {
			if (call_user_func($f, $x) === true)
			return $x;
		}
		return null;
	}
	function array_find_all($xs, $f) {
		$results = [];
		foreach ($xs as $x) {
			if (call_user_func($f, $x) === true) {
				array_push($results, $x);
			}
		}
		return count($results) > 0 ? $results : null;
	}
	function greet($chat_id) {
		api("sendMessage", [
			"chat_id" => $chat_id,
			"text" => trim_message("
				👋 Привет. Я помогу выбрать красивый шрифт или особым образом трансформирую твой текст.

				💬 Пришли мне текст, который нужно обработать. Учти, что большинство шрифтов работает только с латиницей.

				⌨️ Еще я умею работать в инлайн режиме, так что можешь в любом диалоге ввести @BiographerBot и сразу писать свой текст.

				Автор: @mikhailsdv
				Мой канал: @FilteredInternet
			"),
			"reply_markup" => json_encode([
				"inline_keyboard" => [
					[
						[
							"text" => "Попробовать инлайн режим",
							"switch_inline_query" => ""
						]
					],
				]
			])
		]);
	}
	function array_rand_item($arr) {
		return $arr[array_rand($arr)];
	}
	function format_time($timestamp) {
		return date("Y-m-d H:i:s", $timestamp);
	}