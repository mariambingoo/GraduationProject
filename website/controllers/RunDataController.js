const fs = require('fs');
const RunData = require('../models/RunDataModel.js');

const createRunData = async (req, res) => {
  const run = new RunData(req.body);

  try {
      await run.save();
      res.status(201).send(run);
  } catch (error) {
      res.status(500);
  }
}

module.exports = {
  createRunData
};
