const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const locationController = controllers.locationController
const middlewares = require("../middlewares")
const { protectRoute, isAdmin } = middlewares

router.get("/", locationController.getLocationsByZoneController)
router.post("/create", protectRoute, isAdmin, locationController.createLocationController)
router.put("/update/:locationId", protectRoute, isAdmin, locationController.updateLocationDetailsController)
router.delete("/delete/:locationId", protectRoute, isAdmin, locationController.deleteLocationController)

module.exports = router
