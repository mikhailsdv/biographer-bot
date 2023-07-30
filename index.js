require("dotenv").config({path: "./src/.env"})
const env = process.env
const bot = require("./src/bot.js")
const {getAll} = require("./src/db.js")
const express = require("express")
const expressApp = express()

expressApp.use(express.json())

expressApp.use(bot.webhookCallback(`/${env.BOT_TOKEN}`))

expressApp.get("/", (req, res) => {
	res.send("Hello World!")
})

module.exports = expressApp
