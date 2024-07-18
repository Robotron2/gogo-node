const nodemailer = require( "nodemailer" )
const Mailgen = require( "mailgen" )
const {formatToCapital} = require( "./formatInput" )

const createTransporter = () => {
    return nodemailer.createTransport( {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    } )
}

const generateEmailContent = ( options, type ) => {
    const mailGenerator = new Mailgen( {
        theme: 'default',
        product: {
            name: 'Gogo Rides',
            link: 'https://gogorides.net',
            logo: '',
            copyright: 'Copyright © 2024 Gogo Rides. All rights reserved.',
        },
    } )

    let emailContent

    switch ( type ) {
        case 'verification':
            emailContent = {
                body: {
                    name: options.fullName,
                    intro: 'You have received this email for account verification on Gogo Rides.',
                    action: {
                        instructions: 'Enter the OTP below to verify!',
                        button: {
                            color: '#FFA500',
                            text: options.verificationCode,
                            link: '',
                        },
                    },
                    outro: 'If you did not request for it, no further action is required on your part.',
                },
            }
            break

        case 'rideBooked':
            emailContent = {
                body: {
                    name: options.driverName,
                    intro: `<h1>New Ride Booking</h1>`,
                    table: {
                        data: [
                            {
                                Pickup: `${ formatToCapital( options?.pickupLocation?.name ) }`,
                                DropOff: `${ formatToCapital( options?.dropoffLocation?.name ) }`,
                                Passengers: `${ options?.passengers }`,
                                Total: `₦${ options?.totalPrice.toString() }`
                            }
                        ],
                    },
                    action: {
                        instructions: 'Log in to your dashboard for more details.',
                        button: {
                            color: '#62A4A6',
                            text: "Dashboard",
                            link: "https://gogo-node-client.vercel.app/driver/dashboard",
                        },
                    },
                    outro: 'If you did not know about this, no further action is required on your part.',
                },
            }
            break

        default:
            throw new Error( 'Invalid email type' )
    }

    return mailGenerator.generate( emailContent )
}

const sendEmail = async ( transporter, options ) => {
    try {
        const emailOptions = {
            from: `Robotron from Gogo Rides <support@gogorides.net>`,
            to: options.email,
            subject: options.subject,
            html: options.template,
        }

        await transporter.sendMail( emailOptions )
        console.log( `Email sent successfully` )

        return {
            success: true,
        }
    } catch ( error ) {
        console.error( `Error sending mail: ${ error.message }` )
        throw error
    }
}

const sendVerificationMail = async ( transporter, options ) => {
    const emailHtml = generateEmailContent( options, 'verification' )
    return sendEmail( transporter, {
        email: options.email,
        subject: "Verify Your Account!",
        template: emailHtml,
    } )
}

const sendRideBookedMail = async ( transporter, options ) => {
    const emailHtml = generateEmailContent( options, 'rideBooked' )
    return sendEmail( transporter, {
        email: options.email,
        subject: "Ride booked",
        template: emailHtml,
    } )
}

const sendAdminCreationEmail = async ( transporter, options ) => {
    const emailHtml = generateEmailContent( options, 'adminCreation' )
    return sendEmail( transporter, {
        email: options.email,
        subject: "DebizFood Admin Details",
        template: emailHtml,
    } )
}

const EmailService = {
    createTransporter,
    sendEmail,
    sendVerificationMail,
    sendAdminCreationEmail,
    sendRideBookedMail
}

module.exports = EmailService