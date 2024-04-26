const mongoose = require("mongoose")

const carSchema = mongoose.Schema({
	driver: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "driver",
		required: true,
	},
	model: {
		type: String,
		required: true,
	},
	vin: {
		type: String,
		required: true,
	},
	platenumber: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		required: true,
	},
})

const Car = mongoose.model("car", carSchema)
module.exports = Car
