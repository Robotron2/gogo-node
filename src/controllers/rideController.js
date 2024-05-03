const { isValidObjectId } = require("mongoose")
const models = require("../models")
const Driver = models.Driver
const Ride = models.Ride
const Car = models.Car
const Location = models.Location
const Pricing = models.Pricing
const { io } = require("../socket/socket")
// const bookRideController = async (req, res) => {
// 	const { pickupArea, dropoffArea, passengers, reroute, paymentType, rideType } = req.body

// 	const { user } = req

// 	try {
// 		if (!pickupArea || !isValidObjectId(pickupArea) || !dropoffArea || !isValidObjectId(dropoffArea)) {
// 			return res.status(400).json({ error: "Please provide both pickup and drop-off locations" })
// 		}
// 		// Find available driver
// 		let availableDriver
// 		let pricing
// 		let basePrice
// 		let totalPrice
// 		if (rideType === "interstate") {
// 			availableDriver = await Driver.findOne({
// 				isInterstateEnabled: rideType === "interstate",
// 				status: "active",
// 			})
// 			if (!availableDriver) {
// 				return res
// 					.status(404)
// 					.json({ error: "No available drivers for this interstate ride type" })
// 			}
// 		}
// 		// For intrastate
// 		availableDriver = await Driver.findOne({
// 			isInterstateEnabled: rideType === "interstate",
// 			status: "active",
// 		})
// 		if (!availableDriver) {
// 			return res.status(404).json({ error: "No available drivers for this intrastate ride type" })
// 		}

// 		pricing = await Pricing.findOne({
// 			$or: [
// 				{ pickupLocation: pickupArea, dropoffLocation: dropoffArea },
// 				{ pickupLocation: dropoffArea, dropoffLocation: pickupArea },
// 			],
// 		})

// const car = await Car.findOne({ driver: availableDriver._id })

// 		if (car === null) return res.status(400).json({ error: "You don't have a car yet." })

// 		basePrice = rideType === "interstate" ? pricing.interstatePrice : pricing.intrastatePrice
// 		totalPrice = basePrice * passengers * (reroute ? 1.5 : 1)

// 		// Create a ride
// 		const newRide = new Ride({
// 			user: user._id,
// 			car: car._id,
// 			pickup: pickupArea,
// 			dropoff: dropoffArea,
// 			paymentType,
// 			price: totalPrice.toString(),
// 			passengers,
// 			reroute,
// 			rideType,
// 			paymentStatus: paymentType === "cash" ? "paid" : "pending",
// 		})
// 		await newRide.save()
// io.to(availableDriver.socketId).emit("rideBooked", { ride: newRide })
// 		availableDriver.status = "driving"
// 		availableDriver.save()

// 		res.status(201).json(newRide)
// 	} catch (error) {
// 		console.log(error)
// 		res.status(500).json({ error: "Failed to book the ride", message: error.message })
// 	}
// }

const bookRideController = async (req, res) => {
	const { pickupArea, dropoffArea, passengers, reroute, paymentType, rideType } = req.body

	const { user } = req

	try {
		if (!isValidObjectId(pickupArea) || !isValidObjectId(dropoffArea)) {
			return res.status(400).json({ error: "Please provide valid pickup and drop-off locations" })
		}

		let availableDriver = await Driver.findOne({
			isInterstateEnabled: rideType === "interstate",
			status: "active",
		})
		if (!availableDriver) {
			return res.status(404).json({ error: `No available drivers for this ${rideType} ride type` })
		}

		const pricing = await Pricing.findOne({
			$or: [
				{ pickupLocation: pickupArea, dropoffLocation: dropoffArea },
				{ pickupLocation: dropoffArea, dropoffLocation: pickupArea },
			],
		})

		//Pricing === zero
		if (
			!pricing ||
			(rideType === "interstate" && pricing.interstatePrice === 0) ||
			(rideType === "intrastate" && pricing.intrastatePrice === 0)
		) {
			return res.status(404).json({ error: "No pricing available for this ride" })
		}

		// Get the names of the pickup and drop-off locations
		const pickupLocation = await Location.findById(pickupArea)
		const dropoffLocation = await Location.findById(dropoffArea)

		const basePrice = rideType === "interstate" ? pricing.interstatePrice : pricing.intrastatePrice
		const totalPrice = basePrice * passengers * (reroute ? 1.5 : 1)

		const car = await Car.findOne({ driver: availableDriver._id })

		const newRide = new Ride({
			user: user._id,
			car: car._id,
			pickup: pickupLocation ? pickupLocation.name : "Unknown",
			dropoff: dropoffLocation ? dropoffLocation.name : "Unknown",
			paymentType,
			price: totalPrice.toString(),
			passengers,
			reroute,
			rideType,
			paymentStatus: paymentType === "cash" ? "paid" : "pending",
		})

		await newRide.save()
		availableDriver.status = "driving"
		await availableDriver.save()

		io.to(availableDriver.socketId).emit("rideBooked", {
			ride: newRide,
			status: availableDriver?.status,
		})
		res.status(201).json(newRide)
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: "Failed to book the ride", message: error.message })
	}
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
