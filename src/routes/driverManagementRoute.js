const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const driverManagement = controllers.driverManagementController

const middlewares = require("../middlewares")
const { protectRoute, isAdmin } = middlewares

router.get("/get-drivers", protectRoute, isAdmin, driverManagement.getAllDriverController)

module.exports = router
