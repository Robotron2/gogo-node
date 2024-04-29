const models = require("../models")
const Ride = models.Ride
const Pricing = models.Pricing
const bookRideController = async (req, res) => {
	//
}

const getUserRidesController = async (req, res) => {
	try {
		const { user } = req

		const rides = await Ride.find({ user: user._id })

		if (rides.length === 0) {
			return res.status(404).json({ error: "No rides available. Book now" })
		}

		return res.status(200).json({ rides })
	} catch (error) {
		console.error("Error in getLocationsByZoneController:", error)
		return res.status(500).json({ error: "Internal server error" })
	}
}

module.exports = {
	bookRideController,
	getUserRidesController,
}
