const express = require( 'express' )
const router = express.Router()
const models = require( "../models" )
const DriverSubSchema = models.DriverSubSchema

router.post( '/subscribe-driver', async ( req, res ) => {
    const {subscription, driverId} = req.body
    // console.log( 'Driver ID:', driverId )
    // console.log( 'Subscription:', subscription )

    try {
        if ( !driverId || !subscription || !subscription.endpoint ) {
            return res.status( 400 ).json( {error: "Invalid subscription data"} )
        }


        let existingSubscription = await DriverSubSchema.findOne( {driverId} )

        if ( existingSubscription ) {

            existingSubscription.endpoint = subscription.endpoint
            existingSubscription.keys = subscription.keys
            await existingSubscription.save()
        } else {

            const newDriverSub = new DriverSubSchema( {
                driverId,
                endpoint: subscription.endpoint,
                keys: subscription.keys
            } )
            await newDriverSub.save()
        }

        res.status( 201 ).json( {success: true} )
    } catch ( error ) {
        console.error( 'Error in subscribe-driver route:', error.message )
        res.status( 500 ).json( {error: 'Internal server error'} )
    }
} )

module.exports = router
