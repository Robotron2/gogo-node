require( "dotenv" ).config()
const express = require( "express" )
const cookieParser = require( "cookie-parser" )
const cors = require( "cors" )
const connectToDB = require( "./src/config/db" )
const {app, server} = require( "./src/socket/socket" )
const cronJobs = require( "./cronJob" )
const port = process.env.PORT || 4000

const routes = require( "./src/routes" )
const adminRoute = routes.adminRoutes
const authRoute = routes.authRoutes
const driverAuthRoute = routes.driverAuthRoutes
const driverRoute = routes.driverRoutes
const locationRoute = routes.locationRoutes
const pricingRoute = routes.pricingRoutes
const rideRoute = routes.rideRoutes
const userManagementRoute = routes.userManagementRoutes
const driverManagementRoute = routes.driverManagementRoutes
const driverSubRoute = routes.driverSubRoutes
const rideManagementRoute = routes.rideManagementRoutes

app.use(
    cors( {
        origin: process.env.CLIENT_ORIGIN,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    } )
)

app.use( express.json() )
app.use( cookieParser() )

app.use( "/api/admin", adminRoute )
app.use( "/api/auth", authRoute )
app.use( "/api/auth/driver", driverAuthRoute )
app.use( "/api/driver", driverRoute )
app.use( "/api/location", locationRoute )
app.use( "/api/pricing", pricingRoute )
app.use( "/api/ride", rideRoute )
app.use( "/api/admin/user-management", userManagementRoute )
app.use( "/api/admin/driver-management", driverManagementRoute )
app.use( "/api/admin/ride-management", rideManagementRoute )
app.use( "/api/push-subscription", driverSubRoute )

app.get( "/", ( req, res ) => {
    res.status( 200 ).json( {
        success: true,
        message: "Server running properly",
    } )
} )

app.get( '/ping', ( req, res ) => {
    res.send( 'Pong' )
} )

server.listen( port, () => {
    connectToDB()
    console.log( `App is running on port ${ port }` )
} )
