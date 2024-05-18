const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const userManagement = controllers.userManagementController

const middlewares = require("../middlewares")
const { protectRoute, isAdmin } = middlewares

router.get("/get-users", protectRoute, isAdmin, userManagement.getAllUsersController)
router.get("/manage-user-status", protectRoute, isAdmin, userManagement.handleUserStatusController)

module.exports = router
