const mongoose = require('mongoose')
require('dotenv').config({ path: '../config/dev.env'})

const ModelDataSchema = new mongoose.Schema({
    model_arch:{
        type: Buffer,
        required: true
    },
    params:{
        type: Object,
        required: true,
    },
    modelID:{
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'Models'
    }
})

const ModelData = mongoose.model('ModelData', ModelDataSchema, 'ModelssData'); 


module.exports = ModelData;