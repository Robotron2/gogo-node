const models = require("../models")
const Location = models.Location
const Pricing = models.Pricing

const generatePricingCombinations = async () => {
	try {
		const locations = await Location.find()
		let count = 0

		for (let i = 0; i < locations.length; i++) {
			for (let j = i + 1; j < locations.length; j++) {
				const existingEntry1 = await Pricing.findOne({
					pickupLocation: locations[i]._id,
					dropoffLocation: locations[j]._id,
				})

				const existingEntry2 = await Pricing.findOne({
					pickupLocation: locations[j]._id,
					dropoffLocation: locations[i]._id,
				})

				if (!existingEntry1 && !existingEntry2) {
					const newPricing = new Pricing({
						pickupLocation: locations[i]._id,
						dropoffLocation: locations[j]._id,
						intrastatePrice: 0,
						interstatePrice: 0,
					})
					await newPricing.save()
					count++
				}
			}
		}

		console.log(`Generated ${count} new pricing combinations.`)
		return true
	} catch (error) {
		console.error("Failed to generate pricing combinations:", error)
		return false
	}
}

module.exports = generatePricingCombinations
