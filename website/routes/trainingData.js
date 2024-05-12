const express = require('express');
const router = express.Router();

const controller = require('../controllers/trainingData');

router.post("/", controller.getTrainingData);

module.exports = router;
