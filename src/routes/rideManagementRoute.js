const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const rideManagementController = controllers.rideManagementController

const middlewares = require("../middlewares")
const { protectRoute, isAdmin } = middlewares

router.get("/get-rides", protectRoute, isAdmin, rideManagementController.getAllRides)

module.exports = router
