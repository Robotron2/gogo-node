// cronJobs.js
const cron = require( 'node-cron' )
const axios = require( 'axios' )
const models = require( "./src/models" )
const Ride = models.Ride
const User = models.User
const HistoricalData = models.History

const updateHistoricalData = async () => {
    try {
        const totalRides = await Ride.countDocuments()
        const totalUsers = await User.countDocuments()

        const newHistoricalData = new HistoricalData( {
            date: new Date(),
            totalRides,
            totalUsers
        } )

        await newHistoricalData.save()
        console.log( 'Historical data updated successfully.' )
    } catch ( error ) {
        console.error( 'Error updating historical data:', error.message )
    }
}

// Midnight update
cron.schedule( '0 0 * * *', updateHistoricalData )

const pingServer = async () => {
    try {
        console.log( "Start ping" )
        const api = process.env.SERVER_API
        const response = await axios.get( api )
        console.log( 'Ping successful:', response.status )
    } catch ( error ) {
        console.error( 'Error pinging server:', error.message )
    }
}

// Schedule the cron job to run every 60 minutes
cron.schedule( '0 * * * *', pingServer )
