const fs = require('fs');

module.exports = {
    getTrainingData: (req, res) => {
      const { training_loss, training_accuracy, validation_loss, validation_accuracy } = req.body;
      res.send(
        {training_loss, training_accuracy, validation_loss, validation_accuracy}
      );
      console.log({training_loss, training_accuracy, validation_loss, validation_accuracy});
    },

    getModelWeights: (req, res) => {
      try {
        const file = req.file;
        const filePath = `uploads/${file.filename}`;
        fs.renameSync(file.path, filePath);
        res.json({ message: 'Model file uploaded successfully!' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error uploading model file' });
      }
    },

    getPlots: (req, res) => {
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
};
