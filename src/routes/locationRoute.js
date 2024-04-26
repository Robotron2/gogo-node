const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const locationController = controllers.locationController

router.get("/", locationController.getLocationsByZoneController)
router.post("/create", locationController.createLocationController)
router.put("/update/:locationId", locationController.updateLocationDetailsController)
router.delete("/delete/:locationId", locationController.deleteLocationController)

module.exports = router
