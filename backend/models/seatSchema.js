const mongoose = require('mongoose')


const seatSchema = new mongoose.Schema( {
    xd: String,
    number : Number,
    color: String,
    _id: mongoose.Schema.Types.ObjectId
} )

const Seat = mongoose.model( 'Seat', seatSchema )

module.exports = Seat;