const fs = require('fs');
const Model = require('../models/ModelModel.js');

const createModel = async (req, res) => {
  const model = new Model(req.body);

  try {
      await model.save();
      res.status(201).send(model);
  } catch (error) {
      res.status(500);
  }
}

const updateModel = async (req, res) => {

}

// const setModelAttr = async (req, res) => {
//   const model = await Model.findById(req.params.id);
// }

module.exports = {
  createModel,
  updateModel
};
