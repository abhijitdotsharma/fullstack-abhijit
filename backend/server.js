const express = require('express');
const mongoose = require('mongoose')
const cors = require("cors");

const router = require('./routes/pricingRoutes');

const app = express();

app.use(express.json())
app.use(cors())

const URI = 'mongodb+srv://<YOUR DETAILS HERE>';

mongoose.connect(URI)
    .then(() => {
        app.listen(8000, () => {
            console.log('Connected to DB & Server running on port 8000');
        })
    })
    .catch((err) => {
        console.log(err)
})

app.use('/api', router)