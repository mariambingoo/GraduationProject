const express = require('express');
const modelController = require('../controllers/ModelController.js');
const runController = require('../controllers/RunController.js');
const runDataController = require('../controllers/RunDataController.js');
const modelDataController = require('../controllers/ModelDataController.js');
const packageRouter = express.Router();
const {uploadPackageFile} = require('../middleware/upload_files')


packageRouter.post("/model/create", modelController.createModel);
packageRouter.patch("/model/update/:id", modelController.updateModel);
packageRouter.post("/model/data/create", modelDataController.createModelData);
packageRouter.post("/model/files/upload", uploadPackageFile ,modelDataController.uploadModelFiles);
// packageRouter.post("/model/files/create", upload().single('modelFile'),modelDataController.uploadModelFiles);
// packageRouter.get("/model/files/download/:fileId", modelDataController.downloadModelFiles);
packageRouter.post("/run/create", runController.createRun);
packageRouter.post("/run/data/create", runDataController.createRunData);

module.exports = packageRouter;