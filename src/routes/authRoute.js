const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const authController = controllers.authController

router.post("/register", authController.registerController)
router.post("/login", authController.loginController)
router.post("/logout", authController.logoutController)

module.exports = router
