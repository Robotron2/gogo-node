const mongoose = require("mongoose")

const stateSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
})

const State = mongoose.model("state", stateSchema)
module.exports = State
