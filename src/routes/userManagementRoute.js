const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const userManagement = controllers.userManagementController

const middlewares = require("../middlewares")
const { protectRoute, isAdmin } = middlewares

router.get("/get-users", userManagement.getAllUsersController)
// router.get("/get-users", protectRoute, isAdmin, (req, res) => {
// 	res.status(200)
// })

module.exports = router
