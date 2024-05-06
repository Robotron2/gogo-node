const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const driverController = controllers.driverController
const middlewares = require("../middlewares")
const protectDriverRoute = middlewares.protectDriverRoute

router.get("/get-driver-info", protectDriverRoute, driverController.getDriverInfoController)
router.get("/get-car-info", protectDriverRoute, driverController.getDriverCarController)
router.put("/toggle-status", protectDriverRoute, driverController.toggleDriverStatus)

module.exports = router
