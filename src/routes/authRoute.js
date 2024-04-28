const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const authController = controllers.authController

const middlewares = require("../middlewares")
const protectRoute = middlewares.protectRoute

router.post("/register", authController.registerController)
router.post("/login", authController.loginController)
router.post("/logout", authController.logoutController)
router.get("/authorize-user", protectRoute, authController.authorizeUserController)

module.exports = router
