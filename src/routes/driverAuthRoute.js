const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const driverAuthController = controllers.driverAuthController

router.post("/register", driverAuthController.registerDriver)
router.post("/login", driverAuthController.loginDriver)
router.post("/logout", driverAuthController.logoutDriver)

module.exports = router
