const fs = require('fs');
const ModelData = require('../models/ModelDataModel.js');
const { ObjectId } = require('mongodb');
// const mongoose = require('mongoose');

const createModelData = async (req, res) => {
  const modelData = new ModelData(req.body);

  try {
      await modelData.save();
      res.status(201).send(model);
  } catch (error) {
      res.status(500);
  }
}

const uploadModelFiles = async (req, res) => {
  try {
      console.log(req.file)
      const modelData = await ModelData.find({modelId: ObjectId(req.body.modelID)})
      modelData.model_arch = req.file.path
      modelData.params.automatic_data = req.body.params.automatic_data
      modelData.params.manual_data = req.body.params.manual_data
      await modelData.save()
      console.log("Data received from 7ggoo")
      res.status(201).send('File uploaded successfully!');
      return;
    } catch (error) {
        res.status(500).send(error);
    }
  }

// const downloadModelFiles = async (req, res) => {
//   try {
//     const { fileId } = req.params;

//     // Check if file exists
//     console.log(bucket)
//     const file = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
//     if (file.length === 0) {
//     return res.status(404).json({ error: { text: "File not found" } });
//     }

//     // set the headers
//     res.set("Content-Type", file[0].contentType);
//     res.set("Content-Disposition", `attachment; filename=${file[0].filename}`);

//     // create a stream to read from the bucket
//     const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

//     // pipe the stream to the response
//     downloadStream.pipe(res);
// } catch (error) {
//     console.log(error);
//     res.status(400).json({error: { text: `Unable to download file`, error }});
// }
//   };

module.exports = {
  createModelData,
  uploadModelFiles,
  // downloadModelFiles
};
