const express = require("express")
const router = express.Router()
const controllers = require("../controllers")

const middlewares = require("../middlewares")
const models = require("../models")
const Car = models.Car
const Driver = models.Driver

router.post("/create-car", async (req, res) => {
	const { driver, model, vin, platenumber, color } = req.body
	try {
		const match = await Car.findOne({ driver })
		if (match) {
			return res.status(400).json({ error: "Driver owns a car already" })
		}
		const newCar = new Car({
			driver,
			model,
			vin,
			platenumber,
			color,
		})
		const driverDetails = await Driver.findById(driver)
		driverDetails.status = "active"
		await driverDetails.save()
		await newCar.save()

		return res.status(201).json(newCar)
	} catch (error) {
		console.log("Error in create car controller", error.message)
		return res.status(500).json({ error: "Internal server error" })
	}
})

module.exports = router
