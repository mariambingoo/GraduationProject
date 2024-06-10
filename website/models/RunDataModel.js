const mongoose = require('mongoose')

const filesSchema = new mongoose.Schema({
    reference_string: { type: String, default: '' },
    meta_data: {
      fieldname: { type: String, default: '' },
      originalname: { type: String, default: '' },
      encoding: { type: String, default: '' },
      mimetype: { type: String, default: '' },
      filename: { type: String, default: '' },
      size: { type: Number, default: 0 }
    }
  });

const RunDataSchema = new mongoose.Schema({
    runID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Runs' },
    files: { type: [filesSchema], default: [] },
    params: {
        automatic_data: { type: Object, required: true, default: {} },
        manual_data: { type: Object, default: {} }
      }
})

const RunData = mongoose.model('RunData', RunDataSchema, 'RunsData'); 


module.exports = RunData;