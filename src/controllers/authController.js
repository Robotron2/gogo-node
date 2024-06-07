const bcrypt = require( "bcryptjs" )
const utils = require( "../utils" )
const generateToken = utils.generateToken
const toLower = utils.formatInput.formatToLower
const models = require( "../models" )
const User = models.User

const registerController = async ( req, res ) => {
    try {
        const {fullname, email, password} = req.body

        const user = await User.findOne( {email} )
        if ( user ) {
            return res.status( 400 ).json( {error: "Email already exists"} )
        }

        const salt = await bcrypt.genSalt( 10 )
        const hashedPassword = await bcrypt.hash( password, salt )

        const newUser = new User( {
            fullname: toLower( fullname ),
            email: toLower( email ),
            password: hashedPassword,
        } )

        await newUser.save()
        generateToken( newUser._id, res )

        return res.status( 201 ).json( {
            id: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            isDriver: newUser.isDriver,
            isSuspended: newUser.isSuspended,
        } )
    } catch ( error ) {
        console.log( "Error in signup controller", error.message )
        return res.status( 500 ).json( {error: "Internal server error"} )
    }
}

const loginController = async ( req, res ) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne( {email: toLower( email )} )

        const isPasswordCorrect = await bcrypt.compare( password, user?.password || "" )

        if ( !user || !isPasswordCorrect ) {
            return res.status( 500 ).json( {error: "Invalid credentials"} )
        }
        generateToken( user._id, res )

        return res.status( 200 ).json( {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            isAdmin: user.isAdmin,
            isDriver: user.isDriver,
            isSuspended: user.isSuspended,
        } )
    } catch ( error ) {
        console.log( "Error in login controller", error.message )
        return res.status( 500 ).json( {error: "Internal server error"} )
    }
}

const logoutController = async ( req, res ) => {
    try {
        res.cookie( "jwt", "", {
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === "development" ? "strict" : "None",
        } )

        return res.status( 200 ).json( {
            message: "Logged out successfully",
        } )
    } catch ( error ) {
        console.log( "Error in logout controller", error.message )
        return res.status( 500 ).json( {error: "Internal server error"} )
    }
}

const authorizeUserController = async ( req, res ) => {
    try {
        const {user} = req

        if ( !user ) return res.status( 400 ).json( {error: "Unauthorized"} )
        if ( user.isSuspended ) return res.status( 400 ).json( {error: "Account suspended"} )

        return res.status( 200 ).json( {
            message: "Authorized",
        } )
    } catch ( error ) {
        console.log( "Error in authorize user controller", error.message )
        return res.status( 500 ).json( {error: "Internal server error"} )
    }
}

const authorizeAdminController = async ( req, res ) => {
    try {
        const {user} = req

        if ( !user ) return res.status( 400 ).json( {error: "Unauthorized"} )
        if ( user.isSuspended ) return res.status( 400 ).json( {error: "Account suspended"} )

        return res.status( 200 ).json( {
            message: "Authorized",
        } )
    } catch ( error ) {
        console.log( "Error in authorize user controller", error.message )
        return res.status( 500 ).json( {error: "Internal server error"} )
    }
}

module.exports = {
    authorizeUserController,
    authorizeAdminController,
    loginController,
    registerController,
    logoutController,
}
