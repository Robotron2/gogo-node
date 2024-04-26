const mongoose = require("mongoose")

const rideSchema = mongoose.Schema({
	pickup: {
		type: String,
		required: true,
	},
	dropoff: {
		type: String,
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
		required: true,
	},
	driver: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "driver",
		required: true,
	},
	paymentType: {
		type: String,
		emum: ["cash", "online"],
		required: true,
	},
	price: {
		type: String,
		required: true,
	},
	passengers: {
		type: String,
		required: true,
	},
	reroute: {
		type: Boolean,
		required: true,
		enum: [true, false],
		default: false,
	},
	status: {
		enum: ["paid", "pending"],
		default: "pending",
	},
	createdAt: { type: Date, default: Date.now },
})

const Ride = mongoose.model("ride", rideSchema)

module.exports = Ride
