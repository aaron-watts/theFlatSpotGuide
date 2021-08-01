const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true }};

const spotSchema = new Schema({
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    customLatLon: {
        type: Boolean,
        default: false
    },
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
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    events: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ],
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, opts)

spotSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <a href="/campgrounds/${this._id}">${this.name}</a>
    <p>${this.details.substring(0, 30)}...</p>`;
})

module.exports = mongoose.model('Spot', spotSchema);