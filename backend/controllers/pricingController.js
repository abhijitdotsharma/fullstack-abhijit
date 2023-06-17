const PricingConfig = require('../models/pricingModel');

const calculatePrice = async (req, res) => {
    try {
        const { distance, time, config } = req.body;
        const activeConfig = await PricingConfig.findById(config);
        console.log(activeConfig)

        let { distanceBasePrice, distanceAdditionalPrice, timeMultiplierFactor } = activeConfig;

        if(time > 2 ){ //Keeping a fixed time multiplier for time greater then 2 hours, for the sake of simplicity
          timeMultiplierFactor = 2.5;
        }

        // Price = (DBP + (D * DAP)) * TMF$ where  D → Additional distance traveled
        const price = (distanceBasePrice + (distance * distanceAdditionalPrice)) * timeMultiplierFactor
        console.log(price)
    
        res.json({ price });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}


const getAllPricings = async (req, res) => {
    try {
        const Configs = await PricingConfig.find().sort({ createdAt: -1 })
        res.status(200).json({
            Configs: Configs
        })
    } catch (error) {
        res.status(404).json({
            error: error
        })
    }
}

const createPricing = async (req, res) => {
    try {
        const { distanceBasePrice, distanceAdditionalPrice, timeMultiplierFactor } = req.body;
        const Pricing = await PricingConfig.create({ distanceBasePrice, distanceAdditionalPrice, timeMultiplierFactor })

        res.status(200).json({
            Pricing: Pricing
        })

    } catch (error) {
        res.status(404).json({
            error: error
        })
    }
}

const updatePricing = async (req, res) => {
    try {
        const config_id = req.params.id;
        const { distanceBasePrice, distanceAdditionalPrice, timeMultiplierFactor } = req.body;
        const updatedConfig = await PricingConfig.findByIdAndUpdate(
          config_id,
          {
            distanceBasePrice,
            distanceAdditionalPrice,
            timeMultiplierFactor,
          },
          { new: true }
        );
        res.json(updatedConfig);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}


const deletePricing = async (req, res) => {
    try {
        await PricingConfig.findByIdAndRemove(req.params.id);
        res.json({ message: 'Pricing configuration deleted' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}


module.exports = {getAllPricings, createPricing, updatePricing, deletePricing, calculatePrice}