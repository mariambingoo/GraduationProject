const Model = require('../models/ModelModel');
const ModelData = require('../models/ModelDataModel');


const init_model = async (req, res) => {
  let model, modelData;

  try {
    if (!req.body.model_config){
      return res.status(500).send("Please, specifiy a configuration object")
    }
    if (req.body.model_config.model_name) {
      // Fetching model if exist
      model = await Model.findOne({ model_name: req.body.model_config.model_name });
      if (!model) {
        // Creating model and modelData if it doesn't exist
        model = new Model(req.body.model_config);
        modelData = new ModelData({ modelID: model._id });
      } else {
        modelData = await ModelData.findOne({modelID: model._id})
      }
    }

    console.log("Successfuly initialized a Model and ModelData")
    console.log("Uploading files...")
    
    if (req.files && req.files.length > 0) {
      // Ensure model_arch exists and initialize it if needed
      modelData.model_arch = modelData.model_arch || {};
      modelData.model_arch.reference_string = req.files[0].path;
      modelData.model_arch.meta_data = {
        fieldname: req.files[0].fieldname,
        originalname: req.files[0].originalname,
        encoding: req.files[0].encoding,
        mimetype: req.files[0].mimetype,
        filename: req.files[0].filename,
        size: req.files[0].size
      };

      modelData.files = req.files.map(file => ({
        reference_string: file.path,
        meta_data: {
          fieldname: file.fieldname,
          originalname: file.originalname,
          encoding: file.encoding,
          mimetype: file.mimetype,
          filename: file.filename,
          size: file.size
        }
      }));
    }

    console.log("Files uploaded!")

    if (req.body.params) {
      modelData.params = req.body.params
    }

    if (model) {
      await model.save();
    }

    await modelData.save();
    console.log("All saved :)")
    return res.status(200).send("Operation Successful");
  } catch (error) {
    return res.status(500).send("Couldn't initialize model. Please revise the provided data." );
  }
};

const uploadModelFiles = async (req, res) => {
  try {
    const modelData = await ModelData.findOne({ modelID: req.body.model_id });
    if (!modelData) {
      return res.status(404).send("No model found with the specified Id..." );
    }

    modelData.files = req.files.map(file => ({
      reference_string: file.path,
      meta_data: {
        fieldname: file.fieldname,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        filename: file.filename,
        size: file.size
      }
    }));

    modelData.params.automatic_data = req.body.params.automatic_data;
    modelData.params.manual_data = req.body.params.manual_data;
    await modelData.save();
    
    res.status(201).send('Files uploaded successfully!');
  } catch (error) {
    res.status(500).send(error);
  }
};


const updateModel = async (req, res) => {
  const updateKeys = Object.keys(req.body)
  const allowedUpdates = ['model_name', 'description'];
  const validUpdate = updateKeys.every((update) => allowedUpdates.includes(update))
  
  try{
    if(!validUpdate){
      return res.status(400).send('You cant update these values')
    }

    const model = await Model.findOne({_id: req.params.id});
    updateKeys.forEach((key) => model[key] = req.body[key])
    await model.save()
    res.status(200).send(model)
  } catch(err){
    res.status(500).send(err)
  }
}


module.exports = {
  init_model,
  // createModel,
  updateModel,
  uploadModelFiles
};
