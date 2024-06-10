const mongoose = require('mongoose')
const RunData = require('./RunDataModel')

const RunSchema = new mongoose.Schema({
  run_name:{
    type: String,
    required: true,
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
    default: Date.now,
  },
  projectID:{
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: 'Projects'
  },
  modelID:{
    type: mongoose.Schema.Types.ObjectId,
    // required: fasle,
    ref: 'Models'
  }
})

RunSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const run = this
  await RunData.deleteMany({ runID: run._id })
  next()
})

const Run = mongoose.model('Run', RunSchema, 'Runs')


module.exports = Run