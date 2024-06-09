const mongoose = require('mongoose')
require('dotenv').config({ path: '../config/dev.env'})

const ModelDataSchema = new mongoose.Schema({
    model_arch:{
        type: String,
        required: false
    },
    params:{
        type: Object,
        required: false,
    },
    modelID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Models'
    }
})

const ModelData = mongoose.model('ModelData', ModelDataSchema, 'ModelsData'); 


module.exports = ModelData;