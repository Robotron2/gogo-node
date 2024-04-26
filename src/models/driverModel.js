const mongoose = require("mongoose")

const driverSchema = mongoose.Schema({
	fullaname: {
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
	status: {
		type: String,
		enum: ["active", "driving"],
		default: "active",
	},
})

const Driver = mongoose.model("driver", driverSchema)

module.exports = Driver
