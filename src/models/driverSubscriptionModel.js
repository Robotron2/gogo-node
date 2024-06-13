
const mongoose = require( 'mongoose' )

const driverSubSchema = new mongoose.Schema( {
    endpoint: String,
    keys: {
        p256dh: String,
        auth: String
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true,
        unique: true
    },
} )

module.exports = mongoose.model( 'driverSubSchema', driverSubSchema )
