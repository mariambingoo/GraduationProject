const fs = require('fs');
const Run = require('../models/RunModel.js');

const createRun = async (req, res) => {
  const run = new Run(req.body);

  try {
      await run.save();
      res.status(201).send(run);
  } catch (error) {
      res.status(500);
  }
}

module.exports = {
  createRun
};
