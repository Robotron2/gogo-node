const mongoose = require("mongoose")

const driverSchema = mongoose.Schema({
	fullname: {
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
	isAdmin: {
		type: Boolean,
		default: false,
	},
	isDriver: {
		type: Boolean,
		default: true,
	},
	isInterstateEnabled: {
		type: Boolean,
		default: false,
	},

	status: {
		type: String,
		enum: ["active", "driving", "unavailable"],
		default: "unavailable",
	},
	online: {
		type: Boolean,
		default: false,
	},
	hasCar: {
		type: Boolean,
		default: false,
	},
	socketId: {
		type: String,
	},
})

const Driver = mongoose.model("driver", driverSchema)

module.exports = Driver
