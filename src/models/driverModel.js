const mongoose = require("mongoose")

const driverSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	isSuspended: {
		type: Boolean,
		default: false,
	},
	status: {
		type: String,
		enum: ["active", "driving"],
		default: "active",
	},
	car: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "car",
		required: true,
	},
})

const Driver = mongoose.model("driver", driverSchema)

module.exports = Driver
