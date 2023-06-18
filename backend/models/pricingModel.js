const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pricingSchema = new Schema({
    distanceBasePrice: {
        type: Array,
        required: true
    },
    distanceAdditionalPrice: {
        type: Number,
        required: true
    },
    timeMultiplierFactor: {
        type: Array,
        required: true
    }
});

// pricingModel exported
module.exports = mongoose.model('pricingconfig', pricingSchema);