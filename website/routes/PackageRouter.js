const express = require('express');
const modelController = require('../controllers/ModelController.js');
const runController = require('../controllers/RunController.js');
const runDataController = require('../controllers/RunDataController.js');
const modelDataController = require('../controllers/ModelDataController.js');
const packageRouter = express.Router();

packageRouter.post("/model/create", modelController.createModel);
packageRouter.patch("/model/update/:id", modelController.updateModel);
packageRouter.post("/run/create", runController.createRun);
packageRouter.post("/run/data/create", runDataController.createRunData);
packageRouter.post("/model/data/create", modelDataController.createModelData);

module.exports = packageRouter;