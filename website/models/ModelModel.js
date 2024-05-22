const mongoose = require('mongoose')
require('dotenv').config({ path: '../config/dev.env'})

const ModelScehma = new mongoose.Schema({
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
    ref: 'Project'
  }
})

const Model = mongoose.model('Model', ModelScehma, 'Models')


Model.prototype.saveData = async function () {
    try {
        await this.save()
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = Model