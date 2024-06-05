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

// const setModelAttr = async (req, res) => {
//   const model = await Model.findById(req.params.id);
// }

module.exports = {
  createModel,
  updateModel
};
