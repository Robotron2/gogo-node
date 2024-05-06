const { Server } = require("socket.io")
const http = require("http")
const express = require("express")
const models = require("../models")
const Driver = models.Driver
const User = models.User

const app = express()

const socketClientOrigin = process.env.SOCKET_ORIGIN
const server = http.createServer(app)

const io = new Server(server, {
	cors: {
		origin: [socketClientOrigin],
		methods: ["GET", "POST"],
	},
})

io.on("connection", (socket) => {
	console.log("Conneted", socket.id)
	socket.on("userConnect", async (userId) => {
		try {
			const user = await User.findById(userId)
			if (user) {
				user.socketId = socket.id
				await user.save()
				console.log(`user ${userId} connected with socket ID: ${socket.id}`)
			}
		} catch (error) {
			console.error("Error updating user socketId:", error)
		}
	})

	socket.on("driverConnect", async (driverId) => {
		try {
			const driver = await Driver.findById(driverId)
			if (driver) {
				driver.socketId = socket.id
				await driver.save()
				console.log(`Driver ${driverId} connected with socket ID: ${socket.id}`)
			}
		} catch (error) {
			console.error("Error updating driver socketId:", error)
		}
	})

	socket.on("disconnect", () => {
		console.log("Client disconnected")
	})
})

module.exports = {
	app,
	io,
	server,
}
