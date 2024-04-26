const models = require("../models")
const Location = models.Location
const Pricing = models.Pricing

const generatePricingCombinations = async () => {
	try {
		const locations = await Location.find()
		let count = 0

		for (let i = 0; i < locations.length; i++) {
			for (let j = 0; j < locations.length; j++) {
				if (locations[i]._id.toString() !== locations[j]._id.toString()) {
					const existingEntry = await Pricing.findOne({
						pickupLocation: locations[i]._id,
						dropoffLocation: locations[j]._id,
					})

					if (!existingEntry) {
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
		}

		console.log(`Generated ${count} new pricing combinations.`)
	} catch (error) {
		console.error("Failed to generate pricing combinations:", error)
	}
}

module.exports = generatePricingCombinations
