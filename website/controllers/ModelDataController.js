const fs = require('fs');
const ModelData = require('../models/ModelDataModel.js');

const createModelData = async (req, res) => {
  const model = new ModelData(req.body);

  try {
      await model.save();
      res.status(201).send(model);
  } catch (error) {
      res.status(500);
  }
}

module.exports = {
  createModelData
};
