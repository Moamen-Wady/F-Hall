const express = require( 'express' );
const router = express.Router();
const Xd = require( '../models/xdSchema' );
const mongoose = require( 'mongoose' );

router.route( '/resvd' );
router.post( '/resvd/', async ( req, res ) => {
    var xds = await req.body.chairxds
    var ar = []
    var curr = ( await Xd.find() ).map( ( e ) => {
        ar = [ ...ar, e.Xd ]
        return ar
    } )
    var ok = await xds.filter( ( e ) => ar.indexOf( e ) > -1 )
    var l = ok.length
    if ( l > 0 ) {
        res.send( { check: false } );
    }
    if ( l <= 0 ) { res.send( { check: true } ) }

} )
router.post( '/resvd/:id', async ( req, res ) => {
    var xds = await req.body.chairxds
    var i = 0;
    while ( i < xds.length ) {
        var x = xds[ i ]
        await Xd.create( { Xd: x } );
        i++
    }
    res.send("ok")
} );
router.put( '/resvd/:id', async ( req, res ) => {
    var xds = await req.body.chairxds
    var i = 0;
    while ( i < xds.length ) {
        var x = xds[ i ]
        await Xd.deleteMany( { Xd: x } );
        i++
    }
    res.send("ok")
} );
module.exports = router;