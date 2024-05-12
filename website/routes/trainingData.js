const express = require('express');
const router = express.Router();

const controller = require('../controllers/trainingData');

router.post("/trainingData", controller.getTrainingData);
router.post("/hd5", controller.getModelWeights);

module.exports = router;
