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

ModelSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const model = this
  await Run.deleteMany({ model: model._id })
  next()
})

const Model = mongoose.model('Model', ModelSchema, 'Models')


module.exports = Model