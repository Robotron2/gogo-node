const mongoose = require("mongoose")

// const models = require("../models")
// const utils = require("../utils")
// const State = models.State
// const nigerianStates = utils.nigerianStates
// const saveStatesToDatabase = async () => {
// 	try {
// 		// Delete existing states to avoid duplicates
// 		await State.deleteMany({})

// 		// Save each state to the database
// 		await State.insertMany(nigerianStates.map((state) => ({ name: state })))

// 		console.log("States saved to database successfully.")
// 	} catch (error) {
// 		console.error("Error saving states to database:", error)
// 	}
// }

const connectToDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI)
		console.log("Connected to db")
		// await saveStatesToDatabase()
	} catch (error) {
		console.log(`Error connecting to db ${error}`)
	}
}

module.exports = connectToDB
