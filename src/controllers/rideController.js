const { isValidObjectId } = require("mongoose")
const models = require("../models")
const User = models.User
const Driver = models.Driver
const Ride = models.Ride
const Car = models.Car
const Location = models.Location
const Pricing = models.Pricing
const { io } = require("../socket/socket")

const bookRideController = async (req, res) => {
	const { pickupArea, dropoffArea, passengers, reroute, paymentType, rideType } = req.body

	const { user } = req

	try {
		if (!isValidObjectId(pickupArea) || !isValidObjectId(dropoffArea)) {
			return res.status(400).json({ error: "Please provide valid pickup and drop-off locations" })
		}

		if (pickupArea === dropoffArea) {
			return res.status(400).json({ error: "Pickup area and dropoff area cannot be the same." })
		}

		let availableDriver = await Driver.findOne({
			isInterstateEnabled: rideType === "interstate",
			status: "active",
			hasCar: true,
			online: true,
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
			driver: availableDriver._id,
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

		const page = parseInt(req.query.page) || 1
		const pageSize = parseInt(req.query.pageSize) || 10

		const skip = (page - 1) * pageSize

		const rides = await Ride.find({ user: user._id })
			.select(
				"pickup dropoff reroute price paymentType passenger rideType rideStatus driver createdAt"
			)
			.skip(skip)
			.limit(pageSize)
			.sort({ createdAt: "desc" })

		const totalCount = await Ride.countDocuments({ user: user._id })

		if (rides.length === 0) {
			if (skip === 0) {
				return res.status(404).json({ error: "No rides available. Book now" })
			} else {
				return res.status(200).json({ rides: [], totalCount })
			}
		}

		return res.status(200).json({ rides, totalCount })
	} catch (error) {
		console.error("Error in getUserRidesController:", error)
		return res.status(500).json({ error: "Internal server error" })
	}
}

const getDriverRidesController = async (req, res) => {
	try {
		const { user } = req

		const page = parseInt(req.query.page) || 1
		const pageSize = parseInt(req.query.pageSize) || 10

		const skip = (page - 1) * pageSize

		const rides = await Ride.find({ driver: user._id })
			.select(
				"pickup dropoff reroute price paymentType passenger rideType rideStatus driver createdAt"
			)
			.skip(skip)
			.limit(pageSize)
			.sort({ createdAt: "desc" })

		const totalCount = await Ride.countDocuments({ driver: user._id })

		if (rides.length === 0) {
			if (skip === 0) {
				return res.status(404).json({ error: "No rides available. Book now" })
			} else {
				return res.status(200).json({ rides: [], totalCount })
			}
		}

		return res.status(200).json({ rides, totalCount })
	} catch (error) {
		console.error("Error in getUserRidesController:", error)
		return res.status(500).json({ error: "Internal server error" })
	}
}

const updateRideStatus = async (req, res) => {
	try {
		const { id } = req.query
		const driverId = req.user._id

		if (!id) {
			return res.status(400).json({ error: "Please provide a valid ride id" })
		}

		const updatedRide = await Ride.findByIdAndUpdate(id, { rideStatus: "completed" }, { new: true })

		if (!updatedRide) {
			return res.status(404).json({ error: "Ride not found or not updated" })
		}

		const userId = updatedRide.user
		const user = await User.findById(userId).select("socketId")

		if (!user) {
			return res.status(404).json({ error: "User not found" })
		}
		const updatedDriverStatus = await Driver.findByIdAndUpdate(
			driverId,
			{ status: "active" },
			{ new: true }
		)

		const userSocketId = user.socketId

		io.to(userSocketId).emit("rideCompleted", { message: "Your ride has been completed" })
		io.to(updatedDriverStatus.socketId).emit("rideCompleted", { message: "Ride completed for driver" })

		return res.status(200).json(updatedRide)
	} catch (error) {
		console.error("Error in updateRideStatus controller:", error)
		return res.status(500).json({ error: "Internal server error" })
	}
}

module.exports = {
	bookRideController,
	getUserRidesController,
	getDriverRidesController,
	updateRideStatus,
}
