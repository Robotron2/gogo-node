const { isValidObjectId } = require("mongoose")
const models = require("../models")
const Pricing = models.Pricing

const updateLocationPricingController = async (req, res) => {
	try {
		const { pricingId } = req.params
		const { interstatePrice, intrastatePrice } = req.body

		if (!pricingId || !isValidObjectId(pricingId)) {
			return res.status(400).json({ error: "Invalid pricing ID" })
		}

		const pricing = await Pricing.findById(pricingId)

		if (!pricing) {
			return res.status(404).json({ error: "Pricing not found" })
		}

		if (interstatePrice !== undefined) {
			pricing.interstatePrice = interstatePrice
		}
		if (intrastatePrice !== undefined) {
			pricing.intrastatePrice = intrastatePrice
		}

		await pricing.save()

		return res.status(200).json({ pricing })
	} catch (error) {
		console.error("Error in updateLocationPricing controller:", error)
		return res.status(500).json({ error: "Internal server error" })
	}
}

module.exports = {
	updateLocationPricingController,
}
