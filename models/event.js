const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    spot: {
        type: Schema.Types.ObjectId,
        ref: 'Spot'
    },
    rsvps: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;