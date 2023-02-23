const mongoose = require( 'mongoose' )


const resvSchema = new mongoose.Schema( {
    userName: String,
    email: String,
    chairxds: Array,
    phoneNum1:Number,
    year: String,
    sid: String
} )

const Resv = mongoose.model( 'Resv', resvSchema )

module.exports = Resv;