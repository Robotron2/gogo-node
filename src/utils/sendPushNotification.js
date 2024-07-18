const webpush = require( "web-push" )
const models = require( "../models" )
const Subscription = models.DriverSubSchema


webpush.setVapidDetails(
    'mailto:greyhat320@gmail.com',
    process.env.PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VAPID_KEY
)

const sendNotification = async ( subscription, data ) => {
    try {
        const ntf = await webpush.sendNotification( subscription, JSON.stringify( data ) )
        // console.log( ntf )
    } catch ( error ) {
        if ( error.statusCode === 410 ) {
            console.error( 'Subscription has expired or is no longer valid:', error.endpoint )
            await Subscription.deleteOne( {endpoint: error.endpoint} )
            console.log( 'Deleted expired subscription from database.' )
        } else {
            console.error( 'Error sending notification', error )
        }
    }
}

module.exports = sendNotification