const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pricingSchema = new Schema({
    distanceBasePrice: {
        type: Number,
        required: true
    },
    distanceAdditionalPrice: {
        type: Number,
        required: true
    },
    timeMultiplierFactor: {
        type: Number,
        required: true
    }
});

// pricingModel exported
module.exports = mongoose.model('pricingconfig', pricingSchema);