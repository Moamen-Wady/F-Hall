const express = require( 'express' );
const nodemailer = require( 'nodemailer' );
const router = express.Router();

router.route( '/email' )
router.post( '/email/', async ( req, res ) => {
    var email = req.body.email;
    var user = req.body.user;
    var seat = req.body.seat;
    var transporter = nodemailer.createTransport( {
        service: 'gmail',
        auth: {
            user: 'reserverencebot@gmail.com',
            pass: 'fwasyocbeqsucjvk'
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    } );
    const mailOptions = {
        from: 'reserverencebot@gmail.com',
        to: `${ email }`,
        subject: 'Seat Registered',
        text: `Hi ${ user }, Thank you for using our service 
Your Seat has been booked successfuly and your chair id is ${ seat }`
    };
    transporter.sendMail( mailOptions, function ( err, info ) {
        if ( err )
            console.log( err )
        else
            console.log( info );
        res.send( 'ok' )
    } );
} );

module.exports = router;