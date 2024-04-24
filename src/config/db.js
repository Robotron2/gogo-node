const mongoose = require("mongoose")

const connectToDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI)
		console.log("Connected to db")
	} catch (error) {
		console.log(`Error connecting to db ${error}`)
	}
}

module.exports = connectToDB
