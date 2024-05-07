const isAdmin = async (req, res, next) => {
	try {
		const { user } = req

		if (!user.isAdmin) {
			return res.status(401).json({ error: "Unauthorized to access this route" })
		}

		next()
	} catch (error) {
		console.log("Error in isAdmin middleware", error.message)
		res.status(500).json({ error: "Internal server error" })
	}
}

module.exports = isAdmin
