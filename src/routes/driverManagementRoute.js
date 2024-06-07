const express = require( "express" )
const router = express.Router()
const controllers = require( "../controllers" )
const driverManagement = controllers.driverManagementController

const middlewares = require( "../middlewares" )
const {protectRoute, isAdmin} = middlewares

router.get( "/get-drivers", protectRoute, isAdmin, driverManagement.getAllDriverController )
router.get( "/get-drivers-without-car", protectRoute, isAdmin, driverManagement.getDriversWithoutCar )
router.post( "/assign-car", protectRoute, isAdmin, driverManagement.assignCarController )
router.put( "/update-car-driver", protectRoute, isAdmin, driverManagement.updateCarDriver )
router.put( "/update/ride-type/:id", protectRoute, isAdmin, driverManagement.updateDriverRideType )
router.put( "/update-driver-status", protectRoute, isAdmin, driverManagement.handleDriverStatusController )

module.exports = router
