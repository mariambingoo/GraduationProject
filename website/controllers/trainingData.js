const fs = require('fs');
const TrainingData = require('../models/trainingDataModel');

const saveTrainData = async (req, res) => {
  const data = req.body;
  // console.log({...data});
  try {
    const trainingData = new TrainingData(data);
    console.log(trainingData);
    await trainingData.saveData();
    res.status(200).send({ message: 'Data saved successfully!', data});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving data' });
  }
}

const getTrainData = async (req, res) => {
  try {
    const retrieved = await TrainingData.find();
    res.status(200).send(retrieved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting data' });
  }
}

const getTrainingData = (req, res) => {
  const { training_loss, training_accuracy, validation_loss, validation_accuracy } = req.body;
  res.send(
    {training_loss, training_accuracy, validation_loss, validation_accuracy}
  );

  console.log({training_loss, training_accuracy, validation_loss, validation_accuracy});
}

const getModelWeights= (req, res) => {
  try {
    const file = req.file;
    const filePath = `uploads/${file.filename}`;
    fs.renameSync(file.path, filePath);
    res.json({ message: 'Model file uploaded successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading model file' });
  }
}

const getPlots= (req, res) => {
  try {
    const file = req.file;
    const filePath = `uploads/${file.filename}`;
    fs.renameSync(file.path, filePath);
    res.json({ message: 'Model plot uploaded successfully!' });
    console.log(req.file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading model plot' });
  }
}

module.exports = {
  getTrainingData,
  getModelWeights,
  getPlots,
  saveTrainData,
  getTrainData
};
