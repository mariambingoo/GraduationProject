const mongoose = require('mongoose')
require('dotenv').config({ path: '../config/dev.env'})

const RunDataSchema = new mongoose.Schema({
    runID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Runs'
    },
    model:{
        type: Object,
        required: true
    },
    automatic_data:{
        type: Object,
        required: true,
    },
    manual_data:{
        type: Object,
        required: false,
    }
})

const RunData = mongoose.model('RunData', RunDataSchema, 'RunsData'); 


module.exports = RunData;