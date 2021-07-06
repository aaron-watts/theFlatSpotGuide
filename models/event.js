const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    spot: {
        type: Schema.Types.ObjectId,
        ref: 'Spot'
    }
})

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;