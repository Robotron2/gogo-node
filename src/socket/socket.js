const { Server } = require("socket.io")
const http = require("http")
const express = require("express")

const app = express()

const socketClientOrigin = process.env.SOCKET_ORIGIN
const server = http.createServer(app)

const io = new Server(server, {
	cors: {
		origin: [socketClientOrigin],
		methods: ["GET", "POST"],
	},
})

module.exports = {
	app,
	io,
	server,
}
