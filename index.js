require("dotenv").config({path: "./src/.env"})
const env = process.env
const bot = require("./src/bot.js")
const {getAll} = require("./src/db.js")
const express = require("express")
const expressApp = express()

expressApp.use(bot.webhookCallback(`/${env.BOT_TOKEN}`))

expressApp.get(`/db/${env.BOT_TOKEN}`, async (req, res) => {
	const table = await getAll()
	res.send(`<pre>${JSON.stringify(table, null, 2)}</pre>`)
})

expressApp.get("/", (req, res) => {
	res.send("Hello World!")
})

module.exports = expressApp
