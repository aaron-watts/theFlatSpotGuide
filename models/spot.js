const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const spotSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    }
})

const Spot = mongoose.model('Spot', spotSchema);

module.exports = Spot;