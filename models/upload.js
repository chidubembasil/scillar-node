const mongoose = require('mongoose');

const uploadSchema = mongoose.Schema({
    property_title: {
        type: String,
        required: true,
        minlength: 3
    },
    property_type: {
        type: String,
        required: [true, "Select your type of property"]
    },
    listing_property: {
        type: String,
        required: true
    },
    rental_duration: {
        type: String,
        required: false
    },
    investment_plan: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    location: {
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    }, 
    state:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    zipcode:{
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    year_built: {
        type: Number,
        required: false
    },
    bedroom: {
        type: Number,
        required: false,
        min: 1
    },
    bathroom: {
        type: Number,
        required: false,
        min: 1
    },
    square_feet: {
        type: Number,
        required: true,
        min: 1
    },
    parking_space: {
        type: Number,
        required: false
    },
    property_images: {
        type: [String],   // array of image URLs
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Upload", uploadSchema);
