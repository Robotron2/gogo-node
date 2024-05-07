const jwt = require("jsonwebtoken")
const models = require("../models")
const User = models.User

const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt
		if (!token) {
			return res.status(401).json({ error: "Unauthorized. No token provided" })
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized. Invalid token provided" })
		}
		const user = await User.findById(decoded.userId).select("-password")
		if (!user) {
			return res.status(401).json({ error: "User not found. Kindly login." })
		}
		if (user.isSuspended === true)
			return res.status(401).json({ error: "Unauthorized. Suspended account" })
		req.user = user
		next()
	} catch (error) {
		console.log("Error in protect route middleware", error.message)
		res.status(500).json({ error: "Internal server error" })
	}
}

module.exports = protectRoute
