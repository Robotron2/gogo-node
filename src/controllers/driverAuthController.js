const bcrypt = require("bcryptjs")
const utils = require("../utils")
const generateToken = utils.generateToken
const models = require("../models")
const Driver = models.Driver

const registerDriver = async (req, res) => {
	try {
		const { fullname, email, password } = req.body

		const driver = await Driver.findOne({ email })
		if (driver) {
			return res.status(400).json({ error: "Email already exists" })
		}

		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		const newDriver = new Driver({
			fullname,
			email,
			password: hashedPassword,
		})

		await newDriver.save()
		generateToken(newDriver._id, res)
		return res.status(201).json({
			id: newDriver._id,
			fullname: newDriver.fullname,
			email: newDriver.email,
			isAdmin: newDriver.isAdmin,
			isDriver: newDriver.isDriver,
			isSuspended: newDriver.isSuspended,
			isInterstateEnabled: newDriver.isInterstateEnabled,
			status: newDriver.status,
		})
	} catch (error) {
		console.log("Error in signup controller", error.message)
		return res.status(500).json({ error: "Internal server error" })
	}
}

const loginDriver = async (req, res) => {
	try {
		const { email, password } = req.body

		const driver = await Driver.findOne({ email })

		const isPasswordCorrect = await bcrypt.compare(password, driver?.password || "")

		if (!driver || !isPasswordCorrect) {
			return res.status(500).json({ error: "Invalid credentials" })
		}
		generateToken(driver._id, res)

		return res.status(200).json({
			id: driver._id,
			fullname: driver.fullname,
			email: driver.email,
			isAdmin: driver.isAdmin,
			isDriver: driver.isDriver,
			isSuspended: driver.isSuspended,
			isInterstateEnabled: driver.isInterstateEnabled,
			status: driver.status,
		})
	} catch (error) {
		console.log("Error in login controller", error.message)
		return res.status(500).json({ error: "Internal server error" })
	}
}

const logoutDriver = async (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 })

		return res.status(200).json({
			message: "Logged out successfully",
		})
	} catch (error) {
		console.log("Error in logout controller", error.message)
		return res.status(500).json({ error: "Internal server error" })
	}
}

const authorizeDriverController = async (req, res) => {
	try {
		const { user } = req

		if (!user) return res.status(400).json({ error: "Unauthorized" })
		if (user.isSuspended)
			return res.status(400).json({ error: "Account suspended. Kindly contact an admin." })

		return res.status(200).json({
			message: "Authorized",
		})
	} catch (error) {
		console.log("Error in authorize driver controller", error.message)
		return res.status(500).json({ error: "Internal server error" })
	}
}

module.exports = {
	registerDriver,
	loginDriver,
	logoutDriver,
	authorizeDriverController,
}
