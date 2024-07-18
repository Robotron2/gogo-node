const {isValidObjectId} = require( "mongoose" )
const models = require( "../models" )
const User = models.User
const Driver = models.Driver
const Ride = models.Ride
const Car = models.Car
const Location = models.Location
const Pricing = models.Pricing
const Subscription = models.DriverSubSchema
const {io} = require( "../socket/socket" )
const sendNotification = require( "../utils/sendPushNotification" )
const EmailService = require( "../utils/emailSender" )


const bookRideController = async ( req, res ) => {
    const {pickupArea, dropoffArea, passengers, reroute, paymentType, rideType} = req.body
    const {user} = req

    let availableDriver = await Driver.findOne( {
        isInterstateEnabled: rideType === "interstate",
        status: "active",
        hasCar: true,
        online: true,
        isSuspended: false
    } )
    let rideID
    try {
        if ( !isValidObjectId( pickupArea ) || !isValidObjectId( dropoffArea ) ) {
            return res.status( 400 ).json( {error: "Please provide valid pickup and drop-off locations"} )
        }

        if ( pickupArea === dropoffArea ) {
            return res.status( 400 ).json( {error: "Pickup area and dropoff area cannot be the same."} )
        }

        if ( !availableDriver ) {
            return res.status( 404 ).json( {error: `No available drivers for this ${ rideType } ride type`} )
        }

        const pricing = await Pricing.findOne( {
            $or: [
                {pickupLocation: pickupArea, dropoffLocation: dropoffArea},
                {pickupLocation: dropoffArea, dropoffLocation: pickupArea},
            ],
        } )

        if ( !pricing || ( rideType === "interstate" && pricing.interstatePrice === 0 ) || ( rideType === "intrastate" && pricing.intrastatePrice === 0 ) ) {
            return res.status( 404 ).json( {error: "No pricing available for this ride"} )
        }

        const pickupLocation = await Location.findById( pickupArea )
        const dropoffLocation = await Location.findById( dropoffArea )

        const basePrice = rideType === "interstate" ? pricing.interstatePrice : pricing.intrastatePrice
        const totalPrice = basePrice * passengers * ( reroute ? 1.5 : 1 )

        const car = await Car.findOne( {driver: availableDriver._id} )

        const newRide = new Ride( {
            user: user._id,
            car: car._id,
            driver: availableDriver._id,
            pickup: pickupLocation ? pickupLocation.name : "Unknown",
            dropoff: dropoffLocation ? dropoffLocation.name : "Unknown",
            paymentType,
            price: totalPrice.toString(),
            passengers,
            reroute,
            rideType,
            paymentStatus: paymentType === "cash" ? "paid" : "pending",
        } )

        await newRide.save()
        rideID = newRide._id
        availableDriver.status = "driving"
        await availableDriver.save()

        io.to( availableDriver.socketId ).emit( "rideBooked", {
            ride: newRide,
            status: availableDriver?.status,
        } )

        const subscription = await Subscription.findOne( {driverId: availableDriver._id} )

        if ( subscription ) {
            const notificationPayload = {
                title: 'New Ride Booked',
                body: 'You have a new ride request.',
                data: {
                    rideId: newRide._id,
                    pickup: pickupLocation.name,
                    dropoff: dropoffLocation.name,
                    price: `₦${ totalPrice.toString() },`
                }
            }
            await sendNotification( subscription, notificationPayload )
        } else {
            console.log( `No subscription found for driver ${ availableDriver._id }` )
        }

        // Send email to the driver
        const transporter = EmailService.createTransporter()
        try {
            await EmailService.sendRideBookedMail( transporter, {pickupLocation, dropoffLocation, passengers, totalPrice, driverName: availableDriver?.fullname, email: availableDriver?.email} )
        } catch ( error ) {
            console.log( "Error sending booking email to driver" )
        }

        res.status( 201 ).json( newRide )
    } catch ( error ) {
        console.error( 'Error booking ride:', error )
        availableDriver.status = "active"

        await Promise.all( [
            availableDriver.save(),
            Ride.findByIdAndDelete( rideID )

        ] )
        io.to( availableDriver.socketId ).emit( "rideBooked", {
            ride: null,
            status: "active",
        } )
        res.status( 500 ).json( {error: "Failed to book the ride", message: error.message} )
    }
}



const getUserRidesController = async ( req, res ) => {
    try {
        const {user} = req

        const page = parseInt( req.query.page ) || 1
        const pageSize = parseInt( req.query.pageSize ) || 10

        const skip = ( page - 1 ) * pageSize

        const rides = await Ride.find( {user: user._id} )
            .select(
                "pickup dropoff reroute price paymentType passenger rideType rideStatus driver createdAt"
            )
            .skip( skip )
            .limit( pageSize )
            .sort( {createdAt: "desc"} )

        const totalCount = await Ride.countDocuments( {user: user._id} )

        if ( rides.length === 0 ) {
            if ( skip === 0 ) {
                return res.status( 404 ).json( {error: "No rides available. Book now"} )
            } else {
                return res.status( 200 ).json( {rides: [], totalCount} )
            }
        }

        return res.status( 200 ).json( {rides, totalCount} )
    } catch ( error ) {
        console.error( "Error in getUserRidesController:", error )
        return res.status( 500 ).json( {error: "Internal server error"} )
    }
}

const getDriverRidesController = async ( req, res ) => {
    try {
        const {user} = req

        const page = parseInt( req.query.page ) || 1
        const pageSize = parseInt( req.query.pageSize ) || 10

        const skip = ( page - 1 ) * pageSize

        const rides = await Ride.find( {driver: user._id} )
            .select(
                "pickup dropoff reroute price paymentType passenger rideType rideStatus driver createdAt"
            )
            .skip( skip )
            .limit( pageSize )
            .sort( {createdAt: "desc"} )

        const totalCount = await Ride.countDocuments( {driver: user._id} )

        if ( rides.length === 0 ) {
            if ( skip === 0 ) {
                return res.status( 404 ).json( {error: "No rides available. Book now"} )
            } else {
                return res.status( 200 ).json( {rides: [], totalCount} )
            }
        }

        return res.status( 200 ).json( {rides, totalCount} )
    } catch ( error ) {
        console.error( "Error in getUserRidesController:", error )
        return res.status( 500 ).json( {error: "Internal server error"} )
    }
}

const updateRideStatus = async ( req, res ) => {
    try {
        const {id} = req.query
        const driverId = req.user._id

        if ( !id ) {
            return res.status( 400 ).json( {error: "Please provide a valid ride id"} )
        }

        const updatedRide = await Ride.findByIdAndUpdate( id, {rideStatus: "completed"}, {new: true} )

        if ( !updatedRide ) {
            return res.status( 404 ).json( {error: "Ride not found or not updated"} )
        }

        const userId = updatedRide.user
        const user = await User.findById( userId ).select( "socketId" )

        if ( !user ) {
            return res.status( 404 ).json( {error: "User not found"} )
        }
        const updatedDriverStatus = await Driver.findByIdAndUpdate(
            driverId,
            {status: "active"},
            {new: true}
        )

        const userSocketId = user.socketId

        io.to( userSocketId ).emit( "rideCompleted", {message: "Your ride has been completed"} )
        io.to( updatedDriverStatus.socketId ).emit( "rideCompleted", {message: "Ride completed for driver"} )

        return res.status( 200 ).json( updatedRide )
    } catch ( error ) {
        console.error( "Error in updateRideStatus controller:", error )
        return res.status( 500 ).json( {error: "Internal server error"} )
    }
}

module.exports = {
    bookRideController,
    getUserRidesController,
    getDriverRidesController,
    updateRideStatus,
}
