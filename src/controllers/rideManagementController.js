const models = require("../models")
const Ride = models.Ride

const getAllRides = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1
		const pageSize = parseInt(req.query.pageSize) || 10
		const skip = (page - 1) * pageSize

		const filter = {}
		const allowedFilters = ["paymentType", "rideType", "rideStatus", "car", "pickup", "dropoff"]
		allowedFilters.forEach((field) => {
			if (req.query[field]) {
				filter[field] = req.query[field]
			}
		})

		if (req.query.minPrice || req.query.maxPrice) {
			filter.price = {}
			if (req.query.minPrice) {
				filter.price.$gte = parseFloat(req.query.minPrice)
			}
			if (req.query.maxPrice) {
				filter.price.$lte = parseFloat(req.query.maxPrice)
			}
		}

		const sortField = req.query.sortField || "createdAt"
		const sortOrder = req.query.sortOrder || "desc"
		const sort = {}
		sort[sortField] = sortOrder

		const allRides = await Ride.find(filter)
			.populate({
				path: "car",
				select: "model",
			})
			.populate({
				path: "driver",
				select: "fullname email",
			})
			.select("pickup dropoff payment price passenger rideStatus rideType reroute createdAt")
			.sort(sort)
			.skip(skip)
			.limit(pageSize)

		const totalCount = await Ride.countDocuments(filter)

		res.status(200).json({ allRides, totalCount })
	} catch (error) {
		console.error("Error in get Rides controller:", error.message)
		return res.status(500).json({ error: "Internal server error" })
	}
}

module.exports = {
	getAllRides,
}
