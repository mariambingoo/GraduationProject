const express = require('express');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const uploadDir = 'uploads/';

if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const upload = multer({ storage });
const router = express.Router();

const controller = require('../controllers/trainingData');

router.post("/trainingData", controller.getTrainingData);
router.post("/hd5", upload.single('modelFile'), controller.getModelWeights);
router.post("/plot", upload.single('modelPlot'), controller.getPlots);

module.exports = router;
