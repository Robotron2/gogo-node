const express = require("express")
const router = express.Router()

const middlewares = require("../middlewares")
const controllers = require("../controllers")
const adminControllers = controllers.adminController

router.post("/create-car", middlewares.isAdmin, adminControllers.createCarController)

module.exports = router
