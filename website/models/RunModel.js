const mongoose = require('mongoose')
require('dotenv').config({ path: '../config/dev.env'})

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
  },
  project:{
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: 'Projects'
  },
    model:{
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'Models'
    }
})

const Run = mongoose.model('Run', RunSchema, 'Runs')


module.exports = Run