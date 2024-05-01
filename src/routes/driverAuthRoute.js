const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const driverAuthController = controllers.driverAuthController
const middlewares = require("../middlewares")
const protectDriverRoute = middlewares.protectDriverRoute

router.post("/register", driverAuthController.registerDriver)
router.post("/login", driverAuthController.loginDriver)
router.post("/logout", driverAuthController.logoutDriver)
router.get("/authorize-driver", protectDriverRoute, driverAuthController.authorizeDriverController)
router.get("/get-driver-info", protectDriverRoute, driverAuthController.authorizeDriverController)

module.exports = router
