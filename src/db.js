require("dotenv").config()
const env = process.env
const {Deta} = require("deta")
const deta = Deta(env.DETA_PROJECT_KEY)
const db = deta.Base("requests")

const saveMessage = async ({chat_id, username, first_name, language_code, message_in, mode}) => {
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

const updateMessage = async ({message_out, command, ...rest}) => {
	await db.put({...rest, command, message_out, status: "finished"})
}

const getLastMessage = async ({chat_id}) => {
	const {items} = await db.fetch({
		chat_id,
		status: "unfinished",
	})
	return items.filter(item => item.mode === "message")[0]
}

const getAll = async () => await db.fetch()

module.exports = {saveMessage, saveInlineQuery, updateMessage, getLastMessage, getAll}
