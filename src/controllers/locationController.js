const utils = require("../utils")
const generatePricingCombinations = utils.generatePricingCombinations
const toLower = utils.formatInput.formatToLower
const models = require("../models")
const { isObjectIdOrHexString } = require("mongoose")
const Location = models.Location

const createLocationController = async (req, res) => {
	try {
		const { name, zone, state } = req.body

		if (!name || !zone || !state) {
			return res.status(400).json({ error: "Provide all location details" })
		}
		const exists = await Location.findOne({
			name: toLower(name),
			zone: toLower(zone),
			state: toLower(state),
		})
		if (exists) {
			return res.status(400).json({ error: "Location already exists." })
		}
		const newLocation = new Location({
			name: toLower(name),
			zone: toLower(zone),
			state: toLower(state),
		})

		await newLocation.save()
		const successfullyGeneratedCombinations = await generatePricingCombinations()

		if (!successfullyGeneratedCombinations) {
			throw Error("Cannot generate new combinations at the moment")
		}

		return res.status(201).json({
			message: "Location created successfully",
		})
	} catch (error) {
		console.log("Error in createLocation controller", error.message)
		return res.status(500).json({ error: "Internal server error" })
	}
}

const getLocationsByZoneController = async (req, res) => {
	try {
		const { zone, state } = req.query

		if (!zone || !state) {
			return res.status(400).json({ error: "Zone and state are required" })
		}

		const locations = await Location.find({ zone: toLower(zone), state: toLower(state) })

		if (locations.length === 0) {
			return res.status(404).json({ error: "No locations found for the provided zone and state" })
		}

		return res.status(200).json({ locations })
	} catch (error) {
		console.error("Error in getLocationsByZoneController:", error)
		return res.status(500).json({ error: "Internal server error" })
	}
}

// Might not be needed.
const updateLocationDetailsController = async (req, res) => {
	try {
		const { locationId } = req.params
		const { name, zone, state } = req.body

		if (!locationId || !isObjectIdOrHexString(locationId)) {
			return res.status(400).json({ error: "Invalid location ID" })
		}

		const location = await Location.findById(locationId)

		if (!location) {
			return res.status(404).json({ error: "Location not found" })
		}

		if (name !== undefined) {
			location.name = name
		}
		if (zone !== undefined) {
			location.zone = zone
		}
		if (state !== undefined) {
			location.state = state
		}

		await location.save()
		const successfullyGeneratedCombinations = await generatePricingCombinations()
		if (!successfullyGeneratedCombinations) {
			throw Error("Cannot generate new combinations at the moment")
		}

		return res.status(200).json({ message: "Location updated successfully" })
	} catch (error) {
		console.error("Error in updateLocationDetails controller:", error)
		return res.status(500).json({ error: "Internal server error" })
	}
}

// This is for pricing model
// const updateLocationDetailsController = async (req, res) => {
// 	try {
// 		const { locationId } = req.params
// 		const { interstatePrice, intrastatePrice } = req.body

// 		if (!locationId || !isObjectIdOrHexString(locationId)) {
// 			return res.status(400).json({ error: "Invalid location ID" })
// 		}

// 		const location = await Location.findById(locationId)

// 		if (!location) {
// 			return res.status(404).json({ error: "Location not found" })
// 		}

// 		if (interstatePrice !== undefined) {
// 			location.interstatePrice = interstatePrice
// 		}
// 		if (intrastatePrice !== undefined) {
// 			location.intrastatePrice = intrastatePrice
// 		}

// 		// Save the updated location details
// 		await location.save()

// 		return res.status(200).json({ location })
// 	} catch (error) {
// 		console.error("Error in updateLocationDetails controller:", error)
// 		return res.status(500).json({ error: "Internal server error" })
// 	}
// }

const deleteLocationController = async (req, res) => {
	try {
		const { locationId } = req.params

		if (!locationId || !isObjectIdOrHexString(locationId)) {
			return res.status(400).json({ error: "Invalid location ID" })
		}

		const location = await Location.findById(locationId)

		if (!location) {
			return res.status(404).json({ error: "Location not found" })
		}

		await Location.findByIdAndDelete(locationId)

		const successfullyGeneratedCombinations = await generatePricingCombinations()

		if (!successfullyGeneratedCombinations) {
			throw Error("Cannot generate new combinations at the moment")
		}

		return res.status(200).json({ message: "Location deleted successfully" })
	} catch (error) {
		console.error("Error in deleteLocationDetails controller:", error)
		return res.status(500).json({ error: "Internal server error" })
	}
}

module.exports = {
	createLocationController,
	getLocationsByZoneController,
	updateLocationDetailsController,
	deleteLocationController,
}
