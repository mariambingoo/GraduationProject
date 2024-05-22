const express = require('express');
const projectController = require('../controllers/ProjectController.js');
const modelController = require('../controllers/ModelController.js'); // Fix the casing of the import statement
const UIRouter = express.Router();

UIRouter.post("/model/create", modelController.createModel);
UIRouter.patch("/model/update", modelController.updateModel);

module.exports = UIRouter;