const mongoose = require("mongoose")

const pricingSchema = mongoose.Schema(
	{
		pickupLocation: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "location",
			required: true,
		},
		dropoffLocation: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "location",
			required: true,
		},
		intrastatePrice: {
			type: Number,
			required: true,
			default: 0,
		},
		interstatePrice: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{ timestamps: true }
)

const Pricing = mongoose.model("Pricing", pricingSchema)

module.exports = Pricing
