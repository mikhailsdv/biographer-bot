require("dotenv").config()
const env = process.env
const {Deta} = require("deta")

const deta = Deta(env.DETA_PROJECT_KEY)
const db = deta.Base("requests")

;(async () => {
	const {items} = await db.fetch()
	for (const {key} of items) {
		console.log("deleting", key)
		await db.delete(key)
	}
})()
