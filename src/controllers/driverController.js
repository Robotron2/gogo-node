const models = require("../models")
const Driver = models.Driver
const Car = models.Car

const getDriverCarController = async (req, res) => {
	try {
		const { user } = req

		if (!user) return res.status(400).json({ error: "Unauthorized" })

		const car = await Car.findOne({ driver: user._id })

		if (car === null) return res.status(400).json({ error: "You don't have a car yet." })

		return res.status(200).json({ car })
	} catch (error) {
		console.log("Error in authorize get car details controller", error.message)
		return res.status(500).json({ error: "Internal server error" })
	}
}

module.exports = {
	getDriverCarController,
}
