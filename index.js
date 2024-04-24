require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const connectToDB = require("./src/config/db")
const { app, server } = require("./src/socket/socket")

const port = process.env.PORT | 4000

// const authRoute = require("./routes/authRoutes")
// const messageRoute = require("./routes/messageRoutes")
// const userRoute = require("./routes/userRoutes")

app.use(
	cors({
		origin: "http://localhost:5173",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
	})
)

app.use(express.json())
app.use(cookieParser())

// app.use("/api/auth", authRoute)
// app.use("/api/messages", messageRoute)
// app.use("/api/users", userRoute)

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
