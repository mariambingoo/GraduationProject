const fs = require('fs');
const Model = require('../models/ModelModel');
const ModelData = require('../models/ModelDataModel')

const initModel = async (req, res) => {
  let model;
  let modelData;

  try {
    if (req.body.model.model_name) {
      model = await Model.findOne({ model_name: req.body.model.model_name });
      if (!model) {
        model = new Model(req.body.model);
        modelData = new ModelData({ modelID: model._id });
      }
      modelData = await ModelData.findOne({modelID: model._id})
    }

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

    if (req.body.params) {
      modelData.params = req.body.params
    }

    if (model) {
      await model.save();
    }
    await modelData.save();
    return res.status(200).send("Operation Successful");
  } catch (error) {
    return res.status(500).send({ error: "Couldn't initialize model. Please revise the provided data." });
  }
};

const uploadModelFiles = async (req, res) => {
  try {
    const modelData = await ModelData.findOne({ modelID: req.body.model_name });
    if (!modelData) {
      return res.status(404).send({ error: "No model found with the specified Id..." });
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


// const createModel = async (req, res) => {
//   const model = new Model(req.body);
//   const modelData = new ModelData({modelID: model._id})
//   try {
//       await model.save();
//       await modelData.save();
//       console.log(model._id);
//       res.status(200).send(model._id);
//   } catch (error) {
//       res.status(500);
//   }
// }

const updateModel = async (req, res) => {
  const updateKeys = Object.keys(req.body)
  const allowedUpdates = ['model_name', 'description'];
  const validUpdate = updateKeys.every((update) => allowedUpdates.includes(update))
  
  try{
    if(!validUpdate){
      return res.status(400).send({error: 'You cant update these values'})
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
  initModel,
  // createModel,
  updateModel,
  uploadModelFiles
};


// modelData = {
//   model_arch: {
//     reference_string: 'D:/model/files/arc.hd5',
//     meta_data: {
//         fieldname: 'modeFile',
//         originalname: 'arc.hd5',
//         encoding: '7bit',
//         mimetype: 'image/jpeg',
//         filename: 'arc.hd5',
//         size: 473001
//     }
//   },
//   files: [
//     {reference_string: 'D:/model/files/image1.png',
//     meta_data: {
//         fieldname: 'modeFile',
//         originalname: 'image1.png',
//         encoding: '7bit',
//         mimetype: 'image/png',
//         filename: 'image1.png',
//         size: 473001
//     },
//     reference_string: 'D:/model/files/image2.jpeg',
//     meta_data: {
//         fieldname: 'modeFile',
//         originalname: 'image2.jpeg',
//         encoding: '7bit',
//         mimetype: 'image/jpeg',
//         filename: 'image2.jpeg',
//         size: 473001
//     }}
//   ],
//   params: {
//     automatic_data:{...},
//     manual_data: {...}
//   },
//   modelID
// }

// // for images or any files in a separate request
// {
//   req.body{
//     ...,
//     modeID // or model_name
//   }
// }