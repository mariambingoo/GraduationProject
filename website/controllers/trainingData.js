module.exports = {
    getTrainingData: (req, res) => {
      const { training_loss, training_accuracy, validation_loss, validation_accuracy } = req.body;
      res.send(
        "Ay Ay, Captain !"
      );
    },
    getModelWeights: (req, res) => {
      res.send("Ay Ay, Captain !");
    }
};
