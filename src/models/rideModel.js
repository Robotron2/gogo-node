const mongoose = require("mongoose")
const Car = require("./carModel")

const rideSchema = mongoose.Schema(
	{
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
		car: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "car",
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
		paymentStatus: {
			type: String,
			enum: ["paid", "pending"],
			default: "pending",
		},
		rideStatus: {
			type: String,
			enum: ["completed", "pending"],
			default: "pending",
		},
		rideType: {
			type: String,
			enum: ["interstate", "intrastate"],
			default: "intrastate",
		},
		createdAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
)

const Ride = mongoose.model("ride", rideSchema)

module.exports = Ride
