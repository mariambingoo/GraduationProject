const mongoose = require('mongoose')
require('dotenv').config({ path: '../config/dev.env'})

const RunDataSchema = new mongoose.Schema({
    model_weights:{
        type: Buffer,
        required: true
    },
    Model:{
        type: Buffer,
        required: true,
    },
    params:{
        type: Object,
        required: true,
    },
    x_test:{
        type: Buffer,
        required: false,
    },
    y_test:{
        type: Buffer,
        required: false,
    },
    runID:{
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'Runs'
    }
})

const RunData = mongoose.model('RunData', RunDataSchema, 'RunsData'); 


module.exports = RunData;