const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const driverAuthController = controllers.driverAuthController

router.post("/driver/register", driverAuthController.registerDriver)
router.post("/driver/login", driverAuthController.loginDriver)
router.post("/driver/logout", driverAuthController.logoutDriver)

module.exports = router
