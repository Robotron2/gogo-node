const models = require( "../models" )
const Ride = models.Ride

// const getRidesPerMonth = async (req, res) => {
// 	try {
// 		const year = parseInt(req.query.year)

// 		const ridesPerMonth = await Ride.aggregate([
// 			{
// 				$match: {
// 					createdAt: {
// 						$gte: new Date(`${year}-01-01`),
// 						$lte: new Date(`${year}-12-31`),
// 					},
// 				},
// 			},
// 			{
// 				$group: {
// 					_id: { $month: "$createdAt" },
// 					count: { $sum: 1 },
// 				},
// 			},
// 			{
// 				$sort: { _id: 1 },
// 			},
// 			{
// 				$project: {
// 					month: "$_id",
// 					count: 1,
// 					_id: 0,
// 				},
// 			},
// 		])

// 		res.status(200).json({ year, ridesPerMonth })
// 	} catch (error) {
// 		console.error("Error in getting rides per month:", error.message)
// 		return res.status(500).json({ error: "Internal server error" })
// 	}
// }

// const getRidesPerMonth = async (req, res) => {
// 	try {
// 		const year = parseInt(req.query.year)

// 		const ridesPerMonth = await Ride.aggregate([
// 			{
// 				$match: {
// 					createdAt: {
// 						$gte: new Date(`${year}-01-01`),
// 						$lte: new Date(`${year}-12-31`),
// 					},
// 				},
// 			},
// 			{
// 				$group: {
// 					_id: { $month: "$createdAt" },
// 					totalIncome: { $sum: { $toDouble: "$price" } },
// 				},
// 			},
// 			{
// 				$sort: { _id: 1 },
// 			},
// 			{
// 				$project: {
// 					name: {
// 						$dateToString: {
// 							format: "%b",
// 							date: { $dateFromParts: { year: year, month: "$_id" } },
// 						},
// 					},
// 					Income: "$totalIncome",

// 					_id: 0,
// 				},
// 			},
// 		])

// 		res.status(200).json(ridesPerMonth)
// 	} catch (error) {
// 		console.error("Error in getting rides per month:", error.message)
// 		return res.status(500).json({ error: "Internal server error" })
// 	}
// }

// hhhh

// const getRideTypeDistribution = async (req, res) => {
// 	try {
// 		const rideTypeDistribution = await Ride.aggregate([
// 			{
// 				$group: {
// 					_id: "$rideType",
// 					count: { $sum: 1 },
// 				},
// 			},
// 			{
// 				$project: {
// 					rideType: "$_id",
// 					count: 1,
// 					_id: 0,
// 				},
// 			},
// 		])

// 		res.status(200).json({ rideTypeDistribution })
// 	} catch (error) {
// 		console.error("Error in getting ride type distribution:", error.message)
// 		return res.status(500).json({ error: "Internal server error" })
// 	}
// }

// fjfjjf
// const getRideTypeDistribution = async (req, res) => {
// 	try {
// 		const totalRidesCount = await Ride.countDocuments()
// 		const rideTypeDistribution = await Ride.aggregate([
// 			{
// 				$group: {
// 					_id: "$rideType",
// 					count: { $sum: 1 }, // Count the number of rides for each ride type
// 				},
// 			},
// 			{
// 				$project: {
// 					type: "$_id",
// 					percentage: { $multiply: [{ $divide: ["$count", totalRidesCount] }, 100] }, // Calculate the percentage of each ride type
// 					_id: 0,
// 				},
// 			},
// 		])

// 		res.status(200).json(rideTypeDistribution)
// 	} catch (error) {
// 		console.error("Error in getting ride type distribution:", error.message)
// 		return res.status(500).json({ error: "Internal server error" })
// 	}
// }

// const getAllRides = async (req, res) => {
// 	try {
// 		const page = parseInt(req.query.page) || 1
// 		const pageSize = parseInt(req.query.pageSize) || 10
// 		const skip = (page - 1) * pageSize

// 		const filter = {}
// 		const allowedFilters = ["paymentType", "rideType", "rideStatus", "car", "pickup", "dropoff"]
// 		allowedFilters.forEach((field) => {
// 			if (req.query[field]) {
// 				filter[field] = req.query[field]
// 			}
// 		})

// 		if (req.query.minPrice || req.query.maxPrice) {
// 			filter.price = {}
// 			if (req.query.minPrice) {
// 				filter.price.$gte = parseFloat(req.query.minPrice)
// 			}
// 			if (req.query.maxPrice) {
// 				filter.price.$lte = parseFloat(req.query.maxPrice)
// 			}
// 		}

// 		const sortField = req.query.sortField || "createdAt"
// 		const sortOrder = req.query.sortOrder || "desc"
// 		const sort = {}
// 		sort[sortField] = sortOrder

// 		const allRides = await Ride.find(filter)
// 			.populate({
// 				path: "car",
// 				select: "model",
// 			})
// 			.populate({
// 				path: "driver",
// 				select: "fullname email",
// 			})
// 			.select("pickup dropoff payment price passenger rideStatus rideType reroute createdAt")
// 			.sort(sort)
// 			.skip(skip)
// 			.limit(pageSize)

// 		const totalCount = await Ride.countDocuments(filter)

// 		res.status(200).json({ allRides, totalCount })
// 	} catch (error) {
// 		console.error("Error in get Rides controller:", error.message)
// 		return res.status(500).json({ error: "Internal server error" })
// 	}
// }

const getAllRides = async ( req, res ) => {
    try {
        const page = parseInt( req.query.page ) || 1
        const pageSize = parseInt( req.query.pageSize ) || 10
        const skip = ( page - 1 ) * pageSize

        const filter = {}
        const allowedFilters = ["paymentType", "rideType", "rideStatus", "car", "pickup", "dropoff"]
        allowedFilters.forEach( ( field ) => {
            if ( req.query[field] ) {
                filter[field] = req.query[field]
            }
        } )

        if ( req.query.minPrice || req.query.maxPrice ) {
            filter.price = {}
            if ( req.query.minPrice ) {
                filter.price.$gte = parseFloat( req.query.minPrice )
            }
            if ( req.query.maxPrice ) {
                filter.price.$lte = parseFloat( req.query.maxPrice )
            }
        }

        const sortField = req.query.sortField || "createdAt"
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1
        const sort = {}
        sort[sortField] = sortOrder

        const allRides = await Ride.find( filter )
            .populate( {
                path: "car",
                select: "model",
            } )
            .populate( {
                path: "driver",
                select: "fullname email",
            } )
            .select( "pickup dropoff paymentType price passenger rideStatus rideType reroute createdAt" )
            .sort( sort )
            .skip( skip )
            .limit( pageSize )

        const totalCount = await Ride.countDocuments( filter )

        res.status( 200 ).json( {allRides, totalCount} )
    } catch ( error ) {
        console.error( "Error in get Rides controller:", error.message )
        return res.status( 500 ).json( {error: "Internal server error"} )
    }
}


const getRidesPerMonth = async ( req, res ) => {
    try {
        const year = parseInt( req.query.year )

        const ridesPerMonth = await Ride.aggregate( [
            {
                $match: {
                    createdAt: {
                        $gte: new Date( `${ year }-01-01` ),
                        $lte: new Date( `${ year }-12-31` ),
                    },
                },
            },
            {
                $group: {
                    _id: {$month: "$createdAt"},
                    income: {$sum: {$toDouble: "$price"}},
                },
            },
            {
                $sort: {_id: 1},
            },
            {
                $project: {
                    month: "$_id",
                    income: "$income",
                    _id: 0,
                },
            },
            {
                $addFields: {
                    name: {
                        $switch: {
                            branches: [
                                {case: {$eq: ["$month", 1]}, then: "Jan"},
                                {case: {$eq: ["$month", 2]}, then: "Feb"},
                                {case: {$eq: ["$month", 3]}, then: "Mar"},
                                {case: {$eq: ["$month", 4]}, then: "Apr"},
                                {case: {$eq: ["$month", 5]}, then: "May"},
                                {case: {$eq: ["$month", 6]}, then: "Jun"},
                                {case: {$eq: ["$month", 7]}, then: "Jul"},
                                {case: {$eq: ["$month", 8]}, then: "Aug"},
                                {case: {$eq: ["$month", 9]}, then: "Sep"},
                                {case: {$eq: ["$month", 10]}, then: "Oct"},
                                {case: {$eq: ["$month", 11]}, then: "Nov"},
                                {case: {$eq: ["$month", 12]}, then: "Dec"},
                            ],
                            default: "Unknown",
                        },
                    },
                },
            },
            {
                $project: {_id: 0},
            },
        ] )

        res.status( 200 ).json( ridesPerMonth )
    } catch ( error ) {
        console.error( "Error in getting rides per month:", error.message )
        return res.status( 500 ).json( {error: "Internal server error"} )
    }
}

const getRideTypeDistribution = async ( req, res ) => {
    try {
        const rideTypeDistribution = await Ride.aggregate( [
            {
                $group: {
                    _id: "$rideType",
                    count: {$sum: 1},
                },
            },
        ] )

        const data = rideTypeDistribution.map( ( entry, index ) => ( {
            name: entry._id,
            value: entry.count,
        } ) )

        res.status( 200 ).json( data )
    } catch ( error ) {
        console.error( "Error in getting ride type distribution:", error.message )
        return res.status( 500 ).json( {error: "Internal server error"} )
    }
}

module.exports = {
    getAllRides,
    getRidesPerMonth,
    getRideTypeDistribution,
}
