const models = require("../models")
const User = models.User

const getAllUsersController = async (req, res) => {
	try {
		const allUsers = await User.find({}).select("email fullname isAdmin isSuspended isDriver")

		if (allUsers.length === 0) {
			return res.status(404).json({ error: "No user available." })
		}

		return res.status(200).json({ allUsers })
	} catch (error) {
		console.log("Error in get users controller", error.message)
		return res.status(500).json({ error: "Internal server error" })
	}
}

module.exports = {
	getAllUsersController,
}
