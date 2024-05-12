module.exports = {
    getTrainingData: (req, res) => {
      const { training_loss, training_accuracy, validation_loss, validation_accuracy } = req.body;
      res.send(
        {training_loss, training_accuracy, validation_loss, validation_accuracy}
      );
      console.log({training_loss, training_accuracy, validation_loss, validation_accuracy});
    },
    getModelWeights: (req, res) => {
      res.send("Ay Ay, Captain !");
    }
};
