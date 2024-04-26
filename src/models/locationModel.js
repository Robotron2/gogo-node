const mongoose = require("mongoose")

const locationSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	zone: {
		type: String,
		required: true,
	},
	state: {
		type: String,
		required: true,
	},
})

const Location = mongoose.model("location", locationSchema)

module.exports = Location
