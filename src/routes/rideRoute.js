const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const rideController = controllers.rideController
const middlewares = require("../middlewares")
const { protectRoute, protectDriverRoute } = middlewares

router.post("/book-ride", protectRoute, rideController.bookRideController)
router.get("/get-user-rides", protectRoute, rideController.getUserRidesController)
router.get("/get-driver-rides", protectDriverRoute, rideController.getDriverRidesController)
router.put("/update-ride-status", protectDriverRoute, rideController.updateRideStatus)

module.exports = router
