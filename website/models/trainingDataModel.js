const mongoose = require('mongoose')
require('dotenv').config({ path: '../config/dev.env'})

const TrainingDataSchema = new mongoose.Schema({}, { strict: false })
const TrainingData = mongoose.model('trainingData', TrainingDataSchema, 'trainingData')


TrainingData.prototype.saveData = async function () {
    try {
        await this.save()
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = TrainingData