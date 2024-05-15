const createCarController = async (req, res) => {
	const { model, vin, platenumber, color } = req.body
	try {
		const newCar = new Car({
			model,
			vin,
			platenumber,
			color,
		})

		await newCar.save()

		return res.status(201).json(newCar)
	} catch (error) {
		console.log("Error in create car controller", error.message)
		return res.status(500).json({ error: "Internal server error" })
	}
}

module.exports = {
	createCarController,
}
