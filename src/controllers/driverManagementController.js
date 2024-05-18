const { isValidObjectId } = require("mongoose")
const models = require("../models")
const Driver = models.Driver
const Car = models.Car

const getAllDriverController = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1
		const pageSize = parseInt(req.query.pageSize) || 10
		const skip = (page - 1) * pageSize

		const filter = {}

		const search = req.query.search
		if (search) {
			filter.$or = [
				{ fullname: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
			]
		}

		const sortField = req.query.sortField || "createdAt"
		const sortOrder = req.query.sortOrder || "desc"
		const sort = {}
		sort[sortField] = sortOrder

		const allDrivers = await Driver.find(filter)
			.select("email fullname isAdmin isSuspended isDriver")
			.sort(sort)
			.skip(skip)
			.limit(pageSize)

		const totalCount = await Driver.countDocuments(filter)

		res.status(200).json({ allDrivers, totalCount })
	} catch (error) {
		console.log("Error in get Drivers controller", error.message)
		return res.status(500).json({ error: "Internal server error" })
	}
}

const assignCarController = async (req, res) => {
	try {
		const { driver } = req.query
		const { model, vin, platenumber, color } = req.body

		if (!driver) {
			return res.status(400).json({ error: "Driver ID is required" })
		}

		const match = await Car.findOne({ driver })

		if (match) {
			return res.status(400).json({ error: "Driver owns a car already" })
		}

		if (!model || !vin || !platenumber || !color) {
			return res.status(400).json({ error: "Please provide all car details" })
		}

		const newCar = new Car({ driver, model, vin, platenumber, color })

		await newCar.save()

		await Driver.findByIdAndUpdate(driver, { hasCar: true })

		return res.status(200).json({ newCar })
	} catch (error) {
		console.error("Error in assign car controller:", error)
		return res.status(500).json({ error: "Failed to assign car", message: error.message })
	}
}

const updateCarDriver = async (req, res) => {
	try {
		const { driver } = req.body
		const { carId } = req.query

		if (!driver) {
			return res.status(400).json({ error: "Driver ID is required" })
		}

		const match = await Car.findOne({ driver })

		if (match) {
			return res.status(400).json({ error: "Driver owns a car already" })
		}

		await Car.findByIdAndUpdate(carId, { driver })

		return res.status(200).json({ message: "Car driver updated successfully" })
	} catch (error) {
		console.error("Error in update car driver controller:", error)
		return res.status(500).json({ error: "Failed to update car driver", message: error.message })
	}
}

const handleDriverStatusController = async (req, res) => {
	const { id } = req.query

	try {
		if (!id || !isValidObjectId) {
			throw Error("Provide a valid user id")
		}

		const driver = await Driver.findById(id)

		await Driver.findByIdAndUpdate({ _id: id }, { isSuspended: !driver.isSuspended })

		res.status(200).json({ message: "User status changed successfully." })
	} catch (error) {
		console.log("Error in handle user status controller", error.message)
		return res.status(500).json({ error: "Internal server error" })
	}
}

module.exports = {
	getAllDriverController,
	assignCarController,
	updateCarDriver,
	handleDriverStatusController,
}
