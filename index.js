require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const connectToDB = require("./src/config/db")
const { app, server } = require("./src/socket/socket")

const port = process.env.PORT | 4000

const routes = require("./src/routes")
const authRoute = routes.authRoutes
const driverAuthRoute = routes.driverAuthRoutes
const locationRoute = routes.locationRoutes
const pricingRoute = routes.pricingRoutes

app.use(
	cors({
		origin: "http://localhost:5173",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
	})
)

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoute)
app.use("/api/auth/driver", driverAuthRoute)
app.use("/api/location", locationRoute)
app.use("/api/pricing", pricingRoute)

app.get("/", (req, res) => {
	res.status(200).json({
		success: true,
		message: "Server running properly",
	})
})

server.listen(port, () => {
	connectToDB()
	console.log(`App is running on port ${port}`)
})
