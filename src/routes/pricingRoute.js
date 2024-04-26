const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const pricingController = controllers.pricingController

router.put("/update/:pricingId", pricingController.updateLocationPricingController)

module.exports = router
