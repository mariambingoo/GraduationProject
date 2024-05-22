const express = require('express');
const projectController = require('../controllers/ProjectController.js');
const modelController = require('../controllers/ModelController.js'); // Fix the casing of the import statement
const packageRouter = express.Router();

packageRouter.post("/model/create", modelController.createModel);
packageRouter.get("/model/get", modelController.getModel);
packageRouter.delete("/model/delete", modelController.deleteModel);
packageRouter.patch("/model/update", modelController.updateModel);
