const mongoose = require( 'mongoose' )

const historicalDataSchema = new mongoose.Schema( {
    date: {type: Date, required: true, unique: true},
    totalRides: {type: Number, required: true},
    totalUser: {type: Number, required: true},
} )

const HistoricalData = mongoose.model( 'HistoricalData', historicalDataSchema )

module.exports = HistoricalData