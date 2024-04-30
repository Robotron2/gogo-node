const models = require("../models")
const Driver = models.Driver
const Ride = models.Ride
const Pricing = models.Pricing
const { isValidObjectId } = require("mongoose")

const bookRideController = async (req, res) => {
	const { pickupArea, dropoffArea, passengers, reroute, paymentType, rideType } = req.body
	// {
	// 	pickupState: 'Ekiti',
	// 	pickupZone: 'ikole',
	// 	dropoffState: 'Ekiti',
	// 	dropoffZone: 'ikole',
	// 	rideType: 'intrastate',
	// 	reroute: 'false',
	// 	passengers: '3',
	// 	paymentType: 'cash',
	// 	pickupArea: '662f6d997e328e94e3a9d9ca',
	// 	dropoffArea: '662f6d9f7e328e94e3a9d9d2'
	//   }
	const { user } = req

	try {
		if (!pickupArea || !isValidObjectId(pickupArea) || !dropoffArea || !isValidObjectId(dropoffArea)) {
			return res.status(400).json({ error: "Please provide both pickup and drop-off locations" })
		}
		// Find available driver
		let availableDriver
		let pricing
		let basePrice
		let totalPrice
		if (rideType === "interstate") {
			availableDriver = await Driver.findOne({
				isInterstateEnabled: rideType === "interstate",
				status: "active",
			})
			if (!availableDriver) {
				return res.status(404).json({ error: "No available drivers for this ride type" })
			}
		}
		// For intrastate
		availableDriver = await Driver.findOne({
			isInterstateEnabled: rideType === "intrastate",
			status: "active",
		})
		if (!availableDriver) {
			return res.status(404).json({ error: "No available drivers for this ride type" })
		}

		pricing = await Pricing.findOne({ pickupLocation: pickupArea, dropoffLocation: dropoffArea })
		basePrice = rideType === "interstate" ? pricing.interstatePrice : pricing.intrastatePrice
		totalPrice = basePrice * passengers * (reroute ? 1.5 : 1)

		// Create a ride
		const newRide = new Ride({
			user: user._id,
			car: availableDriver.car,
			pickup: pickupArea,
			dropoff: dropoffArea,
			paymentType,
			price: totalPrice.toString(),
			passengers,
			reroute,
			rideType,
			paymentStatus: paymentType === "cash" ? "paid" : "pending",
		})
		await newRide.save()
		// io.to(availableDriver.socketId).emit('rideBooked', { ride: newRide });

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
