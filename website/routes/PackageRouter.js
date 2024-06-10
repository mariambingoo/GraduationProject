const express = require('express');
const modelController = require('../controllers/ModelController.js');
const runController = require('../controllers/RunController.js');
const runDataController = require('../controllers/RunDataController.js');
const modelDataController = require('../controllers/ModelDataController.js');
const packageRouter = express.Router();
const {uploadPackageFile} = require('../middleware/upload_files')


packageRouter.post("/model/init", uploadPackageFile, modelController.initModel);
packageRouter.patch("/model/update/:id", modelController.updateModel);
packageRouter.post("/model/files/upload", uploadPackageFile ,modelController.uploadModelFiles);

packageRouter.post("/run/create", runController.createRun);
packageRouter.post("/run/data/create", runDataController.createRunData);

module.exports = packageRouter;