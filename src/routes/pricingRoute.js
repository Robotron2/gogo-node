const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const pricingController = controllers.pricingController
const middlewares = require("../middlewares")
const { protectRoute, isAdmin } = middlewares

router.get("/get-pricings", protectRoute, isAdmin, pricingController.getAllPricing)
router.put("/update/:pricingId", protectRoute, isAdmin, pricingController.updateLocationPricingController)

module.exports = router
