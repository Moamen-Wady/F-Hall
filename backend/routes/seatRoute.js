const express = require( 'express' );
const router = express.Router();
const Seat = require( '../models/seatSchema' );
const mongoose = require( 'mongoose' );
router.route( '/seats' )
router.get( '/seats', async ( req, res ) => {
    const allSeats = await ( Seat.find() );
    res.send( allSeats );
} );
router.get( '/seats/:id', async ( req, res ) => {
    const thisSeat = await ( Seat.findOne( { xd: req.params.id } ) );
    res.send( thisSeat );
} );

router.put( '/seats/:id', async ( req, res ) => {
    var color = req.body.color;
    var xds = req.body.chairxds
    var i = 0;
    while ( i < xds.length ) {
        var x = xds[ i ]
        await ( Seat.findOneAndUpdate( { xd: x }, { color: color } ) );
        i++
    }
    res.send( 'ok' )
} );

module.exports = router;