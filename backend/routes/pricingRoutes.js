const express = require('express');
const { getAllPricings, createPricing, updatePricing, deletePricing, calculatePrice } = require("../controllers/pricingController");

const router = express.Router();

router.get('/', getAllPricings)

router.post('/', createPricing)

router.put('/:id', updatePricing)

router.delete('/:id', deletePricing)

router.post("/calculate", calculatePrice)

module.exports = router