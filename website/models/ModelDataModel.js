const mongoose = require('mongoose');

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

const ModelDataSchema = new mongoose.Schema({
  modelID: { type: mongoose.Schema.Types.ObjectId, required: true },
  model_arch: { type: filesSchema, default: () => ({}) },
  files: { type: [filesSchema], default: [] },
  params: {
    automatic_data: { type: Object, required: true, default: {} },
    manual_data: { type: Object, default: {} }
  }
});

const ModelData = mongoose.model('ModelData', ModelDataSchema, 'ModelsData'); 


module.exports = ModelData;