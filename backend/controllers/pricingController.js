const PricingConfig = require('../models/pricingModel');
// distanceBasePrice = [ {km: 1,  }, {km: 2,  }, { }]

const calculatePrice = async (req, res) => {
  try {
    // 648e7001ec86378407538582
    const { distance, time, config } = req.body;
    const activeConfig = await PricingConfig.findById(config);
    console.log(activeConfig);

    let {
      distanceBasePrice,
      distanceAdditionalPrice,
      timeMultiplierFactor,
    } = activeConfig;

    //   const distanceBasePrice = [
    //     {
    //         "dist": 3,
    //         "price": 80
    //     },
    //     {
    //         "dist": 3.5,
    //         "price": 90
    //     }
    // ]
    const getDistanceBasePrice = (distance, distanceBasePrice) => {
      let dbp = 0;

      const sortedArr = distanceBasePrice.sort(
        (a, b) => a.dist - b.dist
      );
      
      if (distance < sortedArr[0].dist) {
        dbp = sortedArr[0].price;
      } else {
        for (const dbpItem of sortedArr) {
          if (distance >= dbpItem.dist) {
            dbp = dbpItem.price;
            continue;
          }
        }
      }

      return dbp;
    };

    const DBP = getDistanceBasePrice(distance, distanceBasePrice);

    const getTimeMultiplierFactor = (
      time,
      timeMultiplierFactorArr
    ) => {
      let tmf = 0;

      const sortedArr = timeMultiplierFactorArr.sort(
        (a, b) => a.dist - b.dist
      );
      
      if (time < sortedArr[0].time) {
        tmf = sortedArr[0].factor;
      } else {
        for (const tmfItem of sortedArr) {
          if (time >= tmfItem.time) {
            tmf = tmfItem.factor;
            continue;
          }
        }
      }
      return tmf;
    };
    const TMF = getTimeMultiplierFactor(time, timeMultiplierFactor);

    console.log('DBP - ', DBP);
    console.log('TMF - ', TMF);
    // (DBP + (D * DAP)) * TMF
    const price = (DBP + (distance * distanceAdditionalPrice)) * TMF;
    console.log(price);

    res.json({ price });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPricings = async (req, res) => {
  try {
    const Configs = await PricingConfig.find().sort({
      createdAt: -1,
    });
    res.status(200).json({
      Configs: Configs,
    });
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
};

const createPricing = async (req, res) => {
  try {
    const {
      distanceBasePrice,
      distanceAdditionalPrice,
      timeMultiplierFactor,
    } = req.body;
    const Pricing = await PricingConfig.create({
      distanceBasePrice: [...distanceBasePrice],
      distanceAdditionalPrice: distanceAdditionalPrice,
      timeMultiplierFactor: [...timeMultiplierFactor],
    });

    res.status(200).json({
      Pricing: Pricing,
    });
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
};

const updatePricing = async (req, res) => {
  try {
    const config_id = req.params.id;
    const {
      distanceBasePrice,
      distanceAdditionalPrice,
      timeMultiplierFactor,
    } = req.body;
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
};

const deletePricing = async (req, res) => {
  try {
    await PricingConfig.findByIdAndRemove(req.params.id);
    res.json({ message: 'Pricing configuration deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPricings,
  createPricing,
  updatePricing,
  deletePricing,
  calculatePrice,
};
