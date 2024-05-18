const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const driverManagement = controllers.driverManagementController

const middlewares = require("../middlewares")
const { protectRoute, isAdmin } = middlewares

router.get("/get-drivers", protectRoute, isAdmin, driverManagement.getAllDriverController)
router.post("/assign-car", protectRoute, isAdmin, driverManagement.assignCarController)
router.put("/update-car-driver", protectRoute, isAdmin, driverManagement.updateCarDriver)
router.get("/manage-driver-status", protectRoute, isAdmin, driverManagement.handleDriverStatusController)

module.exports = router
