const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const rideController = controllers.rideController
const middlewares = require("../middlewares")
const { protectRoute } = middlewares

router.post("/book-ride", protectRoute, rideController.bookRideController)
router.get("/get-user-rides", protectRoute, rideController.getUserRidesController)
// router.post("/cancel-ride", rideController.loginController)

module.exports = router
