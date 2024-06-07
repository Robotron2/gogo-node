const jwt = require( "jsonwebtoken" )

const generateToken = async ( userId, res ) => {
    const token = jwt.sign( {userId}, process.env.JWT_SECRET, {
        expiresIn: "3d",
    } )

    res.cookie( "jwt", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === "development" ? "strict" : "None",
    } )
}

module.exports = generateToken
