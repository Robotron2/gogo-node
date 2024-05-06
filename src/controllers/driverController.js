const models = require("../models")
const Driver = models.Driver
const Car = models.Car

const getDriverInfoController = async (req, res) => {
	try {
		const { user } = req

		if (!user) return res.status(400).json({ error: "Unauthorized" })

		const driver = await Driver.findById({ _id: user._id }).select("status")

		if (!driver) return res.status(500).json({ error: "Driver info not found" })

		return res.status(200).json({ driver })
	} catch (error) {
		console.log("Error in authorize get car details controller", error.message)
		return res.status(500).json({ error: "Internal server error" })
	}
}
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

const toggleDriverStatus = async (req, res) => {
	try {
		const { status } = req.body
		const driverId = req.user._id

		const driver = await Driver.findById(driverId)
		if (driver.status === "driving") {
			return res.status(400).json({ error: "Cannot change status while driving" })
		}

		await Driver.findByIdAndUpdate(driverId, { status })

		return res.status(200).json({ message: "Driver status updated successfully" })
	} catch (error) {
		console.error("Error updating driver status:", error)
		return res.status(500).json({ error: "Internal server error" })
	}
}

module.exports = {
	getDriverCarController,
	getDriverInfoController,
	toggleDriverStatus,
}
