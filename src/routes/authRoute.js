const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const authController = controllers.authController

const middlewares = require("../middlewares")
const { protectRoute, isAdmin } = middlewares

router.post("/register", authController.registerController)
router.post("/login", authController.loginController)
router.post("/logout", authController.logoutController)
router.get("/authorize-user", protectRoute, authController.authorizeUserController)
router.get("/authorize-admin", protectRoute, isAdmin, authController.authorizeAdminController)

module.exports = router
