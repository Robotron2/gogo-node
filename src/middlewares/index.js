const isAdmin = require("./isAdmin")
const isDriver = require("./isDriver")
const protectRoute = require("./protectRoute")
const protectDriverRoute = require("./protectDriverRoute")
module.exports = {
	isAdmin,
	isDriver,
	protectRoute,
	protectDriverRoute,
}
