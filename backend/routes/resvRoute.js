const express = require( 'express' );
const router = express.Router();
const Resv = require( '../models/resvSchema' );
const mongoose = require( 'mongoose' );
router.route( '/reservations' )
router.get( '/reservations', async ( req, res ) => {
    const allResvs = await ( Resv.find() );
    res.send( allResvs );
} );

router.post( '/reservations/', async ( req, res ) => {
    var userName = req.body.userName
    var phoneNum1 = req.body.phoneNum1
    var email = req.body.email
    var year = req.body.year
    var sid = req.body.sid
    var chairxds = req.body.chairxds
    var thisResv = new Resv( {
        userName: userName,
        phoneNum1: phoneNum1,
        email: email,
        year: year,
        chairxds: chairxds,
        sid: sid
    } )
    thisResv.save();
    console.log( thisResv )
    res.send( 'ok' )
} );

router.delete( '/reservations/:id', async ( req, res ) => {
    const all = await Resv.find();
    const ths = all[ req.params.id ];
    await Resv.deleteOne( ths );
    res.send( 'ok' )
} );
module.exports = router;