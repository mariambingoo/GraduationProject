const express = require('express');
const projectController = require('../controllers/ProjectController.js');
const modelController = require('../controllers/ModelController.js');
const packageRouter = express.Router();

packageRouter.post("/project/create", projectController.createModel);
// packageRouter.get("/project/get", projectController.getProject);
// packageRouter.delete("/project/delete", projectController.deleteProject);
// packageRouter.patch("/project/update", projectController.updateProject);

module.exports = packageRouter;
