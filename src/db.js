require("dotenv").config()
const env = process.env
const {Deta} = require("deta")
const deta = Deta(env.DETA_PROJECT_KEY)
const db = deta.Base("biographer-bot")

const skipUnfinished = async ({chat_id}) => {
	const {items} = await db.fetch({
		chat_id,
		status: "unfinished",
	})
	for (item of items) {
		await db.update({status: "skipped"}, item.key)
	}
}

const saveMessage = async ({chat_id, username, first_name, language_code, message_in, mode}) => {
	await skipUnfinished({chat_id})
	const newItem = await db.put({
		chat_id,
		username,
		first_name,
		language_code,
		message_in,
		mode: "message",
		status: "unfinished",
		date: new Date().toISOString(),
	})
	return Boolean(newItem?.key)
}

const saveInlineQuery = async ({
	chat_id,
	username,
	first_name,
	language_code,
	message_in,
	command,
	message_out,
}) => {
	const newItem = await db.put({
		chat_id,
		username,
		first_name,
		language_code,
		message_in,
		command,
		message_out,
		mode: "inline_query",
		status: "finished",
		date: new Date().toISOString(),
	})
	return Boolean(newItem?.key)
}

const updateMessage = async ({key, message_out, command}) => {
	await db.update({command, message_out, status: "finished"}, key)
}

const getLastMessage = async ({chat_id}) => {
	const {items} = await db.fetch({
		chat_id,
		status: "unfinished",
	})
	return items[0]
}

const getAll = async () => await db.fetch()

module.exports = {
	skipUnfinished,
	saveMessage,
	saveInlineQuery,
	updateMessage,
	getLastMessage,
	getAll,
}
