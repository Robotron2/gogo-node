const isDriver = async (req, res, next) => {
	try {
		const { user } = req

		if (!user.isDriver) {
			return res.status(401).json({ error: "Unauthorized to access this route" })
		}
		next()
	} catch (error) {
		console.log("Error in isDriver middleware", error.message)
		res.status(500).json({ error: "Internal server error" })
	}
}

module.exports = isDriver
