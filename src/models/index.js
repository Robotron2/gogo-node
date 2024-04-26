const carModel = require("./carModel")
const driverModel = require("./driverModel")
const locationModel = require("./locationModel")
const pricingModel = require("./pricingModel")
const rideModel = require("./rideModel")
const userModel = require("./userModel")

module.exports = {
	Car: carModel,
	Driver: driverModel,
	Location: locationModel,
	Pricing: pricingModel,
	Ride: rideModel,
	User: userModel,
}
