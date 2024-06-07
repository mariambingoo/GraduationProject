const fs = require('fs');
const ModelData = require('../models/ModelDataModel.js');

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
    const files = req.files;
    if (!files) {
      res.status(400).send('No file uploaded');
      return;
    }
    res.status(201).send(files);
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = {
  createModelData,
  uploadModelFiles
};
