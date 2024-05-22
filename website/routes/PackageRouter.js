const express = require('express');
const modelController = require('../controllers/ModelController.js');
const packageRouter = express.Router();

packageRouter.post("/model/create", modelController.createModel);
packageRouter.patch("/model/update/:id", modelController.updateModel);

module.exports = packageRouter;