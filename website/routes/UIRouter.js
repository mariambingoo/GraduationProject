const express = require('express');
const projectController = require('../controllers/ProjectController.js');
const UIRouter = express.Router();

UIRouter.post("/project/create", projectController.createModel);

module.exports = UIRouter;