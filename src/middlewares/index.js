const isAdmin = require("./isAdmin")
const protectRoute = require("./protectRoute")
const protectDriverRoute = require("./protectDriverRoute")
module.exports = {
	isAdmin,
	protectRoute,
	protectDriverRoute,
}
