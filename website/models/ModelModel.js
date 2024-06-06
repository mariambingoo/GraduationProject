const mongoose = require('mongoose')
require('dotenv').config({ path: '../config/dev.env'})

const ModelSchema = new mongoose.Schema({
  model_name:{
    type: String,
    required: true,
    trim: true,
  },
  description:{
    type: String,
    required: false,
    trim: true,
  },
  date_created:{
    type: Date,
    required: true,
    default: Date.now,
  },
  last_modified:{
    type: Date,
    required: false,
  },
  project:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Projects'
  }
})

ModelSchema.virtual('project',{
  ref: 'Project',
  localField: 'project',
  foreignField: '_id'
})

const Model = mongoose.model('Model', ModelScehma, 'Models')


module.exports = Model