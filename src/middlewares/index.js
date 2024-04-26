const isAdmin = require("./isAdmin")
const isDriver = require("./isDriver")
const protectRoute = require("./protectRoute")
module.exports = {
	isAdmin,
	isDriver,
	protectRoute,
}
