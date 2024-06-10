const express = require('express');
const modelController = require('../controllers/ModelController.js');
const runController = require('../controllers/RunController.js');
const packageRouter = express.Router();
const {uploadPackageFile} = require('../middleware/upload_files')


packageRouter.post("/model/init", uploadPackageFile, modelController.init_model);
// packageRouter.patch("/model/update/:id", modelController.updateModel);
packageRouter.post("/model/files/upload", uploadPackageFile, modelController.uploadModelFiles);

packageRouter.post("/run/init", uploadPackageFile, runController.init_run);
// packageRouter.post("/run/files/upload", uploadPackageFile, runController.uploadRunFiles);

module.exports = packageRouter;