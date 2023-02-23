const mongoose = require( 'mongoose' )


const xdSchema = new mongoose.Schema({ 
    Xd : { type: String, required: true }
}
)

const xd = mongoose.model( 'Xd', xdSchema )

module.exports = xd;