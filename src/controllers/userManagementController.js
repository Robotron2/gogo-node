const { isValidObjectId } = require("mongoose")
const models = require("../models")
const User = models.User

const getAllUsersController = async (req, res) => {
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

		const allUsers = await User.find(filter)
			.select("email fullname isAdmin isSuspended isDriver")
			.sort(sort)
			.skip(skip)
			.limit(pageSize)

		const totalCount = await User.countDocuments(filter)

		res.status(200).json({ allUsers, totalCount })
	} catch (error) {
		console.log("Error in get users controller", error.message)
		return res.status(500).json({ error: "Internal server error" })
	}
}

const handleUserStatusController = async (req, res) => {
	const { id } = req.query

	try {
		if (!id || !isValidObjectId) {
			throw Error("Provide a valid user id")
		}

		const user = await User.findById(id)

		await User.findByIdAndUpdate({ _id: id }, { isSuspended: !user.isSuspended })

		res.status(200).json({ message: "User status changed successfully." })
	} catch (error) {
		console.log("Error in handle user status controller", error.message)
		return res.status(500).json({ error: "Internal server error" })
	}
}

module.exports = {
	getAllUsersController,
	handleUserStatusController,
}
